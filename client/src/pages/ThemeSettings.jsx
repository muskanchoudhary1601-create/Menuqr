import React, { useEffect, useState } from 'react';
import { Check, Star, MapPin, Sparkles, Palette, Type, Layout, Smartphone, Loader2, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import {
  THEME_PRESETS,
  COLOR_SWATCHES,
  BACKGROUND_LABELS,
  FONT_LABELS,
  CARD_STYLE_LABELS,
  resolveTheme,
} from '../utils/themeStyles';

const ThemeSettings = () => {
  const [draft, setDraft] = useState({
    theme: 'classic',
    primaryColor: '#f97316',
    backgroundStyle: 'white',
    font: 'sans',
    cardStyle: 'rounded',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await api.get('/restaurants/me');
        const r = data.restaurant;
        setDraft({
          theme: r.theme || 'classic',
          primaryColor: r.primaryColor || '#f97316',
          backgroundStyle: r.backgroundStyle || 'white',
          font: r.font || 'sans',
          cardStyle: r.cardStyle || 'rounded',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load theme settings');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const applyPreset = (key) => {
    const preset = THEME_PRESETS[key];
    setDraft({
      theme: key,
      primaryColor: preset.primaryColor,
      backgroundStyle: preset.backgroundStyle,
      font: preset.font,
      cardStyle: preset.cardStyle,
    });
    setSaved(false);
  };

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await api.put('/restaurants/theme', draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save theme');
    } finally {
      setSaving(false);
    }
  };

  const preview = resolveTheme(draft);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
          Loading your theme studio...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Visual Customizer
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Theme Studio
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Customize colors, card styles, and fonts to match your restaurant's brand identity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <Check className="w-4 h-4" /> Changes Published Live
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{saving ? 'Publishing...' : 'Save & Publish Theme'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Studio Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Presets */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-900">One-Click Presets</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Choose a pre-balanced design preset, then customize details below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                  const isSelected = draft.theme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`text-left rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-100 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{preset.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Brand Color */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-900">Brand Accent Color</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Applied to prices, active buttons, highlights, and featured tags.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {COLOR_SWATCHES.map((color) => {
                  const isSelected = draft.primaryColor.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      onClick={() => updateField('primaryColor', color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full transition-transform active:scale-95 shadow-xs ${
                        isSelected ? 'ring-4 ring-orange-200 scale-110' : 'hover:scale-105'
                      }`}
                      aria-label={color}
                    />
                  );
                })}

                {/* Custom Color Input */}
                <label className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 hover:border-orange-500 flex items-center justify-center cursor-pointer relative overflow-hidden transition-colors shadow-xs">
                  <input
                    type="color"
                    value={draft.primaryColor}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[9px] text-slate-400 font-bold">Custom</span>
                </label>

                <span className="text-xs font-mono text-slate-500 ml-2 font-semibold">
                  {draft.primaryColor.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Background Style */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-1">Page Canvas Background</h3>
              <p className="text-xs text-slate-500 mb-4">
                Choose the ambient atmosphere for your diners' phone screens.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {Object.entries(BACKGROUND_LABELS).map(([key, label]) => {
                  const isSelected = draft.backgroundStyle === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateField('backgroundStyle', key)}
                      className={`text-xs font-bold py-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-2 ring-orange-100 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Font */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-900">Typography Font</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Affects all headings, prices, and dish descriptions.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {Object.entries(FONT_LABELS).map(([key, label]) => {
                  const isSelected = draft.font === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateField('font', key)}
                      className={`text-xs font-bold py-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-2 ring-orange-100 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Surface Style */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-900">Dish Card Style</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                The visual framing style for each food card item.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {Object.entries(CARD_STYLE_LABELS).map(([key, label]) => {
                  const isSelected = draft.cardStyle === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateField('cardStyle', key)}
                      className={`text-xs font-bold py-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-2 ring-orange-100 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Phone Preview Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-20 w-full max-w-[340px]">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Smartphone className="w-4 h-4 text-orange-500" />
                  Live Mobile Simulator
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Updates Instantly</span>
              </div>

              {/* Realistic Phone Frame */}
              <div className="w-full bg-slate-950 rounded-[44px] p-3.5 shadow-2xl ring-1 ring-slate-800">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-3.5 bg-black rounded-full mx-auto mb-2 flex items-center justify-end px-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>

                {/* Inner Screen rendering live theme */}
                <div
                  className={`w-full rounded-[34px] overflow-hidden text-slate-900 flex flex-col h-[520px] transition-colors duration-300 ${preview.pageClass}`}
                  style={{ fontFamily: preview.fontFamily }}
                >
                  {/* Top Cover Banner */}
                  <div
                    className="h-24 p-3 flex flex-col justify-end relative"
                    style={{ backgroundColor: preview.primaryColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative z-10 text-white">
                      <h4 className="font-bold text-sm leading-tight">Cafe Mocha Bistro</h4>
                      <p className="text-[10px] opacity-80">Artisanal Dining & Drinks</p>
                    </div>
                  </div>

                  {/* Simulator Category Nav */}
                  <div className="p-2.5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                    <span
                      className="text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-xs"
                      style={{ backgroundColor: preview.primaryColor }}
                    >
                      All
                    </span>
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                        preview.isDark
                          ? 'border-slate-700 text-slate-300'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Pizzas
                    </span>
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                        preview.isDark
                          ? 'border-slate-700 text-slate-300'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Beverages
                    </span>
                  </div>

                  {/* Simulator Food Cards */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {/* Item 1 */}
                    <div className={`overflow-hidden transition-all ${preview.cardClass}`}>
                      <div className="aspect-[16/9] bg-slate-200 relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&auto=format&fit=crop&q=80"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                          style={{ backgroundColor: preview.primaryColor }}
                        >
                          Special
                        </span>
                      </div>
                      <div className="p-3">
                        <h5 className={`font-bold text-xs ${preview.textClass}`}>
                          Margherita Rustica
                        </h5>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${preview.subtextClass}`}>
                          Fresh buffalo mozzarella & basil
                        </p>
                        <p
                          className="text-xs font-black mt-1.5"
                          style={{ color: preview.primaryColor }}
                        >
                          ₹349
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className={`overflow-hidden transition-all ${preview.cardClass}`}>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <h5 className={`font-bold text-xs ${preview.textClass}`}>
                            Iced Caramel Macchiato
                          </h5>
                          <p className={`text-[10px] mt-0.5 ${preview.subtextClass}`}>
                            Vanilla espresso & caramel drizzle
                          </p>
                          <p
                            className="text-xs font-black mt-1.5"
                            style={{ color: preview.primaryColor }}
                          >
                            ₹220
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Bottom Bar */}
                  <div
                    className={`p-2.5 text-center text-[10px] border-t font-semibold ${
                      preview.isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    Interactive Real-Time Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;

