import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Instagram,
  Clock,
  Search,
  ImageOff,
  QrCode,
  Share2,
  Check,
  X,
  Sparkles,
  Flame,
  ChevronRight,
  Info,
} from 'lucide-react';
import api from '../services/api';
import { resolveTheme } from '../utils/themeStyles';
import { trackView } from '../utils/trackView';

// Indian restaurant standard veg/non-veg square icon with inner dot
const DietIndicator = ({ type, showLabel = false }) => {
  const isVeg = type === 'veg';
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <span
        className={`inline-flex items-center justify-center w-3.5 h-3.5 border-2 rounded-[3px] ${
          isVeg ? 'border-emerald-600 bg-emerald-50/50' : 'border-rose-600 bg-rose-50/50'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
      </span>
      {showLabel && (
        <span className={`text-[11px] font-semibold ${isVeg ? 'text-emerald-700' : 'text-rose-700'}`}>
          {isVeg ? 'Pure Veg' : 'Non-Veg'}
        </span>
      )}
    </span>
  );
};

const FoodCard = ({ item, theme, onSelect }) => (
  <div
    onClick={() => onSelect(item)}
    className={`group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] ${theme.cardClass} flex flex-col justify-between`}
  >
    <div>
      {/* Image container */}
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100/80">
            <ImageOff className="w-6 h-6 stroke-[1.5] text-slate-300 mb-1" />
            <span className="text-[10px] font-medium text-slate-400">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isFeatured && (
            <span
              className="text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              Special
            </span>
          )}
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
            <span className="text-white text-xs font-bold bg-rose-600/90 px-2.5 py-1 rounded-full shadow-sm">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Info container */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${theme.textClass}`}>
            {item.name}
          </h3>
          <DietIndicator type={item.dietType} />
        </div>

        {item.description && (
          <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${theme.subtextClass}`}>
            {item.description}
          </p>
        )}
      </div>
    </div>

    <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between border-t border-slate-100/10">
      <span className="text-base font-extrabold" style={{ color: theme.primaryColor }}>
        ₹{item.price}
      </span>
      <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-slate-400">
        Details <ChevronRight className="w-3 h-3" />
      </span>
    </div>
  </div>
);

const PublicMenu = () => {
  const { restaurantSlug } = useParams();
  const [searchParams] = useSearchParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg', 'featured'
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const sectionRefs = useRef({});
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setNotFound(false);
      setError('');
      try {
        const { data } = await api.get(`/public/menu/${restaurantSlug}`);
        setRestaurant(data.restaurant);
        setMenu(data.menu);

        document.title = `${data.restaurant.name} | Digital Menu`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            data.restaurant.description || `Explore the interactive menu for ${data.restaurant.name} on MenuQR.`
          );
        }

        trackView(restaurantSlug, 'menu_view');
        if (searchParams.get('source') === 'qr') {
          trackView(restaurantSlug, 'qr_scan');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Could not load this menu. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantSlug, searchParams]);

  // Client-side search and multi-filtering (search + diet chips)
  const filteredMenu = useMemo(() => {
    let result = menu;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        ),
      }));
    }

    if (dietFilter === 'veg') {
      result = result.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.dietType === 'veg'),
      }));
    } else if (dietFilter === 'non-veg') {
      result = result.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.dietType === 'non-veg'),
      }));
    } else if (dietFilter === 'featured') {
      result = result.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.isFeatured),
      }));
    }

    return result.filter((cat) => cat.items.length > 0);
  }, [menu, search, dietFilter]);

  const visibleMenu =
    activeCategory === 'all'
      ? filteredMenu
      : filteredMenu.filter((cat) => cat._id === activeCategory);

  const totalVisibleItems = visibleMenu.reduce((sum, cat) => sum + cat.items.length, 0);

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    if (id !== 'all' && sectionRefs.current[id]) {
      const el = sectionRefs.current[id];
      const yOffset = -90; // offset for sticky headers
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      trackView(restaurantSlug, 'category_view', { categoryId: id });
    } else if (id === 'all') {
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    trackView(restaurantSlug, 'item_view', { itemId: item._id });
  };

  const handleShareMenu = async () => {
    const url = window.location.href.split('?')[0];
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.name || 'Digital Menu',
          text: `Check out the digital menu for ${restaurant?.name || 'this restaurant'}!`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch {
      // Clipboard write not permitted
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 animate-pulse">
          <QrCode className="w-6 h-6 text-orange-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading digital menu...</p>
        <p className="text-xs text-slate-400 mt-1">Preparing fresh dishes</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Menu Not Found</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This QR code or link does not match any registered restaurant. Please check the URL or ask your server.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <h1 className="text-lg font-bold text-slate-900">Unable to load menu</h1>
          <p className="text-xs text-slate-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasAnyItems = menu.some((cat) => cat.items.length > 0);
  const theme = resolveTheme(restaurant);

  return (
    <div className={`min-h-screen pb-20 ${theme.pageClass}`} style={{ fontFamily: theme.fontFamily }}>
      {/* Cover Image Banner */}
      <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
        {restaurant.coverImage ? (
          <>
            <img
              src={restaurant.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-90 scale-105 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div
            className="w-full h-full opacity-90"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor} 0%, #0f172a 100%)`,
            }}
          />
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4 -mt-16 relative z-10">
        {/* Restaurant Profile Card */}
        <div className={`p-5 rounded-3xl shadow-card transition-all duration-300 ${theme.cardClass}`}>
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shrink-0 ring-4 ring-white shadow-md -mt-10 flex items-center justify-center">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xl font-black"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {restaurant.name?.[0]?.toUpperCase() || 'M'}
                </div>
              )}
            </div>

            {/* Restaurant Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className={`font-extrabold text-xl tracking-tight leading-tight truncate ${theme.textClass}`}>
                  {restaurant.name}
                </h1>
              </div>

              {restaurant.description && (
                <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${theme.subtextClass}`}>
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Info & Hours */}
          <div className="mt-4 pt-3 border-t border-slate-100/20 space-y-1.5">
            {restaurant.openingHours && (
              <div className={`flex items-center gap-2 text-xs ${theme.subtextClass}`}>
                <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{restaurant.openingHours}</span>
              </div>
            )}
            {restaurant.address && (
              <div className={`flex items-center gap-2 text-xs ${theme.subtextClass}`}>
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </div>
            )}
          </div>

          {/* Action Buttons (Call, Directions, Instagram, Share) */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/10">
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Directions
              </a>
            )}
            {restaurant.instagramUrl && (
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
            <button
              onClick={handleShareMenu}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors ml-auto"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Share Menu
                </>
              )}
            </button>
          </div>
        </div>

        {/* Empty Menu State */}
        {!hasAnyItems ? (
          <div className="mt-12 text-center py-16 px-6 bg-white/60 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className={`font-bold text-base ${theme.textClass}`}>Menu under preparation</p>
            <p className={`text-xs mt-1.5 ${theme.subtextClass}`}>
              The chef is updating the dishes. Please check back shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="relative mt-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, drinks, ingredients..."
                className={`w-full rounded-2xl border pl-10 pr-10 py-3 text-sm font-medium transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 ${
                  theme.isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
                style={{ '--tw-ring-color': theme.primaryColor }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary & Highlight Quick Filters */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'veg', label: '🥬 Pure Veg' },
                { id: 'non-veg', label: '🥩 Non-Veg' },
                { id: 'featured', label: '⭐ Chef Specials' },
              ].map((filter) => {
                const active = dietFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setDietFilter(filter.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 shrink-0 ${
                      active
                        ? 'bg-slate-900 text-white shadow-xs'
                        : theme.isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Sticky Horizontal Category Navigation */}
            <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-inherit/90 backdrop-blur-md border-b border-slate-200/40 mt-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => scrollToCategory('all')}
                  style={activeCategory === 'all' ? { backgroundColor: theme.primaryColor } : undefined}
                  className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shadow-xs ${
                    activeCategory === 'all'
                      ? 'text-white shadow-sm'
                      : theme.isDark
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  All Sections
                </button>
                {menu.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => scrollToCategory(cat._id)}
                    style={activeCategory === cat._id ? { backgroundColor: theme.primaryColor } : undefined}
                    className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shadow-xs ${
                      activeCategory === cat._id
                        ? 'text-white shadow-sm'
                        : theme.isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Sections */}
            <div className="mt-6 space-y-9">
              {totalVisibleItems === 0 ? (
                <div className="text-center py-16 px-4 bg-white/40 rounded-2xl border border-slate-100">
                  <p className={`font-semibold text-sm ${theme.textClass}`}>No items found</p>
                  <p className={`text-xs mt-1 ${theme.subtextClass}`}>
                    Try adjusting your search query or dietary filter chips.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setDietFilter('all');
                    }}
                    className="mt-3 text-xs font-bold underline"
                    style={{ color: theme.primaryColor }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                visibleMenu.map((cat) => (
                  <section
                    key={cat._id}
                    ref={(el) => (sectionRefs.current[cat._id] = el)}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-4 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <h2 className={`font-extrabold text-base tracking-tight ${theme.textClass}`}>
                          {cat.name}
                        </h2>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${theme.subtextClass}`}>
                        {cat.items.length} {cat.items.length === 1 ? 'dish' : 'dishes'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {cat.items.map((item) => (
                        <FoodCard
                          key={item._id}
                          item={item}
                          theme={theme}
                          onSelect={handleSelectItem}
                        />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </>
        )}

        {/* Footer Branding */}
        <div className="mt-14 text-center border-t border-slate-200/40 pt-6">
          <p className={`text-[11px] font-medium ${theme.subtextClass}`}>
            Powered by{' '}
            <span className="font-bold tracking-tight text-slate-800">
              Menu<span className="text-orange-600">QR</span>
            </span>
          </p>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="aspect-[16/10] bg-slate-100 relative shrink-0">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageOff className="w-8 h-8 stroke-[1.5] mb-1" />
                  <span className="text-xs">No Photo Available</span>
                </div>
              )}

              {selectedItem.isFeatured && (
                <span
                  className="absolute bottom-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Sparkles className="w-3 h-3" />
                  Chef's Special
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-lg text-slate-900 leading-tight">
                  {selectedItem.name}
                </h3>
                <DietIndicator type={selectedItem.dietType} showLabel />
              </div>

              <p className="text-xl font-extrabold text-orange-600 mt-2">
                ₹{selectedItem.price}
              </p>

              {selectedItem.description && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    About this dish
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Please inform staff of any allergies
                </span>
                <span className={`font-semibold ${selectedItem.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedItem.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Modal Bottom Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full bg-slate-900 text-white font-semibold text-xs py-3 rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenu;

