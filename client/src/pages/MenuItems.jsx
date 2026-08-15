import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  Star,
  X,
  Loader2,
  Camera,
  LayoutGrid,
  List,
  Sparkles,
  Check,
  AlertCircle,
  UploadCloud,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  dietType: 'veg',
  isFeatured: false,
};

const DietIndicator = ({ type }) => {
  const isVeg = type === 'veg';
  return (
    <span
      className={`inline-flex items-center justify-center w-3.5 h-3.5 border-2 rounded-[3px] shrink-0 ${
        isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-rose-600 bg-rose-50'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
    </span>
  );
};

const MenuItems = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [planLimitReached, setPlanLimitReached] = useState(false);

  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.categories);
  };

  const fetchItems = async () => {
    const params = {};
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (search.trim()) params.search = search.trim();
    const { data } = await api.get('/menu-items', { params });
    setItems(data.items);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCategories(), fetchItems()]);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your menu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItems().catch((err) => setError(err.response?.data?.message || 'Could not load menu items'));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, categoryFilter]);

  const categoryNameById = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c._id] = c.name;
    });
    return map;
  }, [categories]);

  // Client-side diet filtering
  const displayedItems = useMemo(() => {
    if (dietFilter === 'all') return items;
    return items.filter((item) => item.dietType === dietFilter);
  }, [items, dietFilter]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({ ...emptyForm, categoryId: categories[0]?._id || '' });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setPlanLimitReached(false);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      categoryId: item.categoryId,
      dietType: item.dietType,
      isFeatured: item.isFeatured,
    });
    setImageFile(null);
    setImagePreview(item.image || '');
    setFormError('');
    setPlanLimitReached(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemovePickedImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) return setFormError('Item name is required');
    if (form.price === '' || Number(form.price) < 0) return setFormError('Enter a valid price');
    if (!form.categoryId) return setFormError('Please select a category');

    setSaving(true);
    try {
      if (editingItem) {
        const { data } = await api.put(`/menu-items/${editingItem._id}`, form);
        let updatedItem = data.item;

        if (imageFile) {
          const fd = new FormData();
          fd.append('image', imageFile);
          const imgRes = await api.post(`/menu-items/${editingItem._id}/image`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          updatedItem = { ...updatedItem, image: imgRes.data.image };
        }

        setItems((prev) => prev.map((i) => (i._id === updatedItem._id ? updatedItem : i)));
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([key, value]) => fd.append(key, value));
        if (imageFile) fd.append('image', imageFile);

        const { data } = await api.post('/menu-items', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setItems((prev) => [...prev, data.item]);
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save item');
      setPlanLimitReached(err.response?.data?.code === 'PLAN_LIMIT_REACHED');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = async (item, field) => {
    setBusyId(item._id);
    const prevItems = [...items];
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, [field]: !i[field] } : i))
    );

    try {
      const { data } = await api.put(`/menu-items/${item._id}`, { [field]: !item[field] });
      setItems((prev) => prev.map((i) => (i._id === item._id ? data.item : i)));
    } catch (err) {
      setItems(prevItems);
      setError(err.response?.data?.message || 'Could not update item');
    } finally {
      setBusyId(null);
    }
  };

  const executeDelete = async (item) => {
    setBusyId(item._id);
    try {
      await api.delete(`/menu-items/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      setDeleteModalItem(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete item');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Dish Inventory
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Menu Items
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add mouth-watering dishes, update live pricing, and toggle instant availability.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            disabled={categories.length === 0}
            className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add New Dish
          </button>
        </div>

        {categories.length === 0 && !loading && (
          <div className="mt-6 flex items-center justify-between p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You need at least one category before you can add dishes.</span>
            </div>
            <Link
              to="/menu/categories"
              className="font-bold underline text-amber-800 hover:text-amber-900"
            >
              Create Category
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-6 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes by name or description..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Diet Quick Filters */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                dietFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                dietFilter === 'veg' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🥬 Veg
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                dietFilter === 'non-veg' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🥩 Non-Veg
            </button>
          </div>

          {/* Grid vs List View Switcher */}
          <div className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items Container */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
              Loading your dishes...
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">No dishes found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {search || categoryFilter !== 'all' || dietFilter !== 'all'
                  ? 'No items matched your search filters. Try clearing some criteria.'
                  : 'Start building your digital menu by adding your signature dishes.'}
              </p>
              {!search && categoryFilter === 'all' && categories.length > 0 && (
                <button
                  onClick={openCreateModal}
                  className="mt-5 btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Your First Dish
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-card hover:-translate-y-1"
                >
                  <div>
                    {/* Image Header */}
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="w-7 h-7 stroke-[1.5] text-slate-300 mb-1" />
                          <span className="text-[10px] font-medium">No Image</span>
                        </div>
                      )}

                      {/* Featured Star Badge */}
                      <button
                        onClick={() => toggleField(item, 'isFeatured')}
                        disabled={busyId === item._id}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                          item.isFeatured
                            ? 'bg-amber-400 text-white shadow-sm'
                            : 'bg-black/30 text-white/80 hover:bg-black/50'
                        }`}
                        title={item.isFeatured ? 'Featured on Top' : 'Mark as Featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-white' : ''}`} />
                      </button>

                      {/* Category Pill */}
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        {categoryNameById[item.categoryId] || 'Category'}
                      </span>
                    </div>

                    {/* Dish Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                          {item.name}
                        </h3>
                        <DietIndicator type={item.dietType} />
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      <p className="text-lg font-black text-slate-900 mt-2.5">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    {/* Live Availability Toggle Button */}
                    <button
                      onClick={() => toggleField(item, 'isAvailable')}
                      disabled={busyId === item._id}
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModalItem(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table/List View */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Dish</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <DietIndicator type={item.dietType} />
                              <span className="font-bold text-slate-900">{item.name}</span>
                              {item.isFeatured && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {categoryNameById[item.categoryId] || '—'}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ₹{item.price}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleField(item, 'isAvailable')}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModalItem(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-base text-slate-900">
                {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-3">
                  {formError}
                  {planLimitReached && (
                    <Link to="/billing" className="font-bold underline ml-1">
                      Upgrade plan
                    </Link>
                  )}
                </div>
              )}

              {/* Drag-and-drop Image Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Food Photo (Recommended)
                </label>
                <label className="relative flex flex-col items-center justify-center aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 transition-colors cursor-pointer overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                        <Camera className="w-4 h-4" /> Change Image
                      </div>
                      <button
                        onClick={handleRemovePickedImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4 text-center">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Click to upload photo</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WebP (up to 5MB)</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dish Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Truffle Mushroom Risotto"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    min={0}
                    step="0.01"
                    placeholder="349"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Dietary Option (Veg / Non-Veg Segmented) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Dietary Tag</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, dietType: 'veg' })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      form.dietType === 'veg'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <DietIndicator type="veg" /> Vegetarian
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, dietType: 'non-veg' })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      form.dietType === 'non-veg'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-100'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <DietIndicator type="non-veg" /> Non-Vegetarian
                  </button>
                </div>
              </div>

              {/* Featured Flag */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleFormChange}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Feature as Chef Special / Bestseller
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-glow w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-orange-500/20 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Menu Item?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">"{deleteModalItem.name}"</span>? This will immediately remove it from your customer menu.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDelete(deleteModalItem)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm shadow-rose-600/20"
              >
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;

