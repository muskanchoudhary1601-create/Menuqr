import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Check, Layers, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const [deletingCategory, setDeletingCategory] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    setAdding(true);
    try {
      const { data } = await api.post('/categories', { name: newName.trim() });
      setCategories((prev) => [...prev, data.category]);
      setNewName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add category');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    setError('');
    setBusyId(id);
    try {
      const { data } = await api.put(`/categories/${id}`, { name: editName.trim() });
      setCategories((prev) => prev.map((c) => (c._id === id ? data.category : c)));
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update category');
    } finally {
      setBusyId(null);
    }
  };

  const toggleEnabled = async (category) => {
    setError('');
    setBusyId(category._id);
    const prevCategories = [...categories];
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c._id === category._id ? { ...c, isEnabled: !c.isEnabled } : c))
    );

    try {
      const { data } = await api.put(`/categories/${category._id}`, { isEnabled: !category.isEnabled });
      setCategories((prev) => prev.map((c) => (c._id === category._id ? data.category : c)));
    } catch (err) {
      setCategories(prevCategories);
      setError(err.response?.data?.message || 'Could not update category');
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async (id) => {
    setError('');
    setBusyId(id);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setDeletingCategory(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete category');
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setCategories(reordered);

    try {
      await api.put('/categories/reorder', { order: reordered.map((c) => c._id) });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save new category order');
      fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Menu Hierarchy
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize dishes into sections like Starters, Chef Specials, Main Courses, and Desserts.
          </p>
        </div>

        {error && (
          <div className="mt-6 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Add Category Form Card */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Create New Category</h3>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Artisanal Wood-Fired Pizzas"
              maxLength={50}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="btn-glow flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add Category</span>
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Existing Categories ({categories.length})
            </h3>
            <span className="text-[11px] text-slate-400">Use arrows to adjust menu order</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {loading ? (
              <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin mb-2" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm text-slate-900">No categories created</p>
                <p className="text-xs text-slate-400 mt-1">
                  Type a category name above to organize your menu items.
                </p>
              </div>
            ) : (
              categories.map((category, index) => (
                <div
                  key={category._id}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-orange-600 disabled:opacity-20 hover:bg-slate-100 rounded transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === categories.length - 1}
                      className="p-1 text-slate-400 hover:text-orange-600 disabled:opacity-20 hover:bg-slate-100 rounded transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category Name or Inline Edit */}
                  {editingId === category._id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        maxLength={50}
                        className="flex-1 rounded-xl border border-orange-400 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => saveEdit(category._id)}
                        disabled={busyId === category._id}
                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg shrink-0"
                        title="Save Name"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg shrink-0"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold truncate ${
                              category.isEnabled ? 'text-slate-900' : 'text-slate-400 line-through'
                            }`}
                          >
                            {category.name}
                          </span>
                          {!category.isEnabled && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => toggleEnabled(category)}
                        disabled={busyId === category._id}
                        className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                          category.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={category.isEnabled ? 'Hide from public menu' : 'Show on public menu'}
                      >
                        {category.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{category.isEnabled ? 'Visible' : 'Hidden'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Name"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete Trigger */}
                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Category Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{deletingCategory.name}"</span>?
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingCategory._id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCategories;

