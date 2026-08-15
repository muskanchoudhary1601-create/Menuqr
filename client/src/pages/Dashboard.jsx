import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Pencil,
  Download,
  BarChart2,
  Layers,
  UtensilsCrossed,
  QrCode,
  Settings,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Palette,
  Printer,
  CreditCard,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getMenuUrl } from '../utils/menuUrl';

const StatCard = ({ icon: Icon, label, value, trend, colorClass, to }) => {
  const content = (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline justify-between mt-1">
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          {to && (
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block focus:outline-none">
      {content}
    </Link>
  ) : (
    content
  );
};

const Dashboard = () => {
  const { user, restaurant } = useAuth();
  const [categoryCount, setCategoryCount] = useState(null);
  const [itemCount, setItemCount] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [copied, setCopied] = useState(false);

  const menuUrl = restaurant ? getMenuUrl(restaurant.slug) : '';

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [categoriesRes, itemsRes, analyticsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/menu-items'),
          api.get('/analytics'),
        ]);
        setCategoryCount(categoriesRes.data.categories.length);
        setItemCount(itemsRes.data.items.length);
        setAnalytics(analyticsRes.data);
      } catch {
        setCategoryCount(0);
        setItemCount(0);
        setAnalytics({ menuViews: 0, qrScans: 0 });
      }
    };
    fetchCounts();
  }, []);

  const copyMenuLink = async () => {
    if (!menuUrl) return;
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Restaurant Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {getTimeGreeting()}, {user?.ownerName || 'Chef'}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here is what is happening with your restaurant's digital menu today.
            </p>
          </div>

          {/* Quick Date Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Digital Menu Online</span>
          </div>
        </div>

        {/* Live Restaurant Card Banner */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Background Flare */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              {restaurant?.logo ? (
                <img
                  src={restaurant.logo}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                  {restaurant?.name?.[0]?.toUpperCase() || 'M'}
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  Live Public Menu
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {restaurant?.name || 'Your Restaurant'}
                </h2>

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-300 font-mono bg-black/40 px-3 py-1 rounded-lg border border-white/10 truncate max-w-xs sm:max-w-md">
                    {menuUrl}
                  </span>
                  <button
                    onClick={copyMenuLink}
                    className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Banner Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {restaurant?.slug && (
                <a
                  href={`/menu/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Live Menu
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <Link
                to="/menu/items"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-white/10"
              >
                <Pencil className="w-4 h-4" />
                Edit Dishes
              </Link>
              <Link
                to="/qr-code"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-white/10"
              >
                <QrCode className="w-4 h-4" />
                QR Studio
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Elevated Stat Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={Eye}
            label="Total Menu Views"
            value={analytics === null ? '—' : analytics.menuViews}
            colorClass="bg-orange-100 text-orange-600"
            to="/analytics"
          />
          <StatCard
            icon={QrCode}
            label="Table QR Scans"
            value={analytics === null ? '—' : analytics.qrScans}
            colorClass="bg-amber-100 text-amber-600"
            to="/analytics"
          />
          <StatCard
            icon={UtensilsCrossed}
            label="Active Menu Items"
            value={itemCount === null ? '—' : itemCount}
            colorClass="bg-emerald-100 text-emerald-600"
            to="/menu/items"
          />
          <StatCard
            icon={Layers}
            label="Menu Categories"
            value={categoryCount === null ? '—' : categoryCount}
            colorClass="bg-indigo-100 text-indigo-600"
            to="/menu/categories"
          />
        </div>

        {/* Quick Operations Action Grid */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Operations</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              to="/menu/items"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Add/Edit Items</span>
            </Link>

            <Link
              to="/menu/categories"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Categories</span>
            </Link>

            <Link
              to="/qr-code"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">QR Studio</span>
            </Link>

            <Link
              to="/qr-code/print"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Print Cards</span>
            </Link>

            <Link
              to="/theme"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Theme Design</span>
            </Link>

            <Link
              to="/billing"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-card transition-all flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Plan & Billing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

