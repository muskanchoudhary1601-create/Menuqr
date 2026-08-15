import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Check,
  Store,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  description: '',
  address: '',
  phone: '',
  whatsapp: '',
  instagramUrl: '',
  googleMapsUrl: '',
  openingHours: '',
};

const RestaurantProfile = () => {
  const { setRestaurant } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await api.get('/restaurants/me');
        const r = data.restaurant;
        setForm({
          name: r.name || '',
          description: r.description || '',
          address: r.address || '',
          phone: r.phone || '',
          whatsapp: r.whatsapp || '',
          instagramUrl: r.instagramUrl || '',
          googleMapsUrl: r.googleMapsUrl || '',
          openingHours: r.openingHours || '',
        });
        setLogo(r.logo || '');
        setCoverImage(r.coverImage || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load restaurant profile');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put('/restaurants/me', form);
      setRestaurant((prev) => (prev ? { ...prev, name: data.restaurant.name } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingCover;
    setUploading(true);

    const formData = new FormData();
    formData.append(type, file);

    try {
      const { data } = await api.post(`/restaurants/${type === 'logo' ? 'logo' : 'cover'}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (type === 'logo') {
        setLogo(data.logo);
      } else {
        setCoverImage(data.coverImage);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Could not upload ${type}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
          Loading your restaurant profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Public Information
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Restaurant Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              This information is displayed prominently on your public digital menu for customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <Check className="w-4 h-4" /> Profile Updated
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Brand Assets (Cover & Logo) Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Branding & Visuals</h3>
            <p className="text-xs text-slate-500 mb-5">
              Upload your restaurant's logo and high-resolution header cover photo.
            </p>

            {/* Cover Banner Uploader */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-44 sm:h-56 group">
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-90" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 stroke-[1.5] mb-1 text-slate-600" />
                  <span className="text-xs font-medium text-slate-400">No Cover Image Selected</span>
                </div>
              )}

              {/* Cover Upload Button Overlay */}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-60"
              >
                {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                {uploadingCover ? 'Uploading...' : 'Change Cover Photo'}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImageSelect(e, 'cover')}
              />

              {/* Logo Avatar overlapping cover */}
              <div className="absolute -bottom-7 left-6">
                <div className="relative w-20 h-20 rounded-2xl ring-4 ring-white shadow-lg bg-white overflow-hidden group/logo">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white font-black text-xl">
                      {form.name?.[0]?.toUpperCase() || 'M'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center text-white transition-opacity"
                    title="Change Logo"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span className="text-[9px] font-bold mt-0.5">Edit</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e, 'logo')}
                />
              </div>
            </div>

            <div className="mt-9 pt-2 text-[11px] text-slate-400">
              Tip: Recommended cover image ratio is 16:9 (1280x720px) and square for the logo (500x500px).
            </div>
          </div>

          {/* General Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 mb-1">General Information</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Restaurant Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Bella Vista Bistro"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                About & Tagline
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                maxLength={300}
                placeholder="Authentic Italian wood-fired pizzas, handmade pastas, and curated wines in Bangalore."
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Contact & Social Links Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Contact & Social Links</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={form.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourrestaurant"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Maps Location Link
                </label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={form.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={form.openingHours}
                onChange={handleChange}
                placeholder="Mon–Sun, 11:00 AM – 11:30 PM"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs px-8 py-3 rounded-2xl shadow-sm shadow-orange-500/20 disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantProfile;

