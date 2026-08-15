import React, { useEffect, useState } from 'react';
import { Eye, QrCode, Star, Layers, BarChart2, TrendingUp, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, subtext, colorClass }) => (
  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-card transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics');
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalViews = data?.menuViews ?? 0;
  const qrScans = data?.qrScans ?? 0;
  const scanRate = totalViews > 0 ? Math.round((qrScans / totalViews) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Performance Metrics
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time breakdown of how diners discover and explore your menu.
          </p>
        </div>

        {error && (
          <div className="mt-6 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center">
            <BarChart2 className="w-8 h-8 text-orange-500 animate-pulse mb-2" />
            Loading analytics data...
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard
                icon={Eye}
                label="Total Menu Views"
                value={totalViews}
                subtext="All web visits & scans combined"
                colorClass="bg-orange-100 text-orange-600"
              />
              <StatCard
                icon={QrCode}
                label="Table QR Scans"
                value={qrScans}
                subtext="In-restaurant table scans"
                colorClass="bg-amber-100 text-amber-600"
              />
              <StatCard
                icon={TrendingUp}
                label="Scan Engagement Rate"
                value={`${scanRate}%`}
                subtext="Proportion of visits from physical QR"
                colorClass="bg-emerald-100 text-emerald-600"
              />
            </div>

            {/* Performance Highlights (Item & Category) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Most Viewed Item */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Rank #1 Dish
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">Most Viewed Item</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase">
                    ★ Customer Favorite
                  </span>
                </div>

                {data?.mostViewedItem ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xl font-extrabold text-slate-900">
                      {data.mostViewedItem.name}
                    </p>
                    <p className="text-xs font-semibold text-orange-600 mt-1">
                      {data.mostViewedItem.views} customer taps
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                    Not enough click data collected yet. Will appear as customers tap items.
                  </div>
                )}
              </div>

              {/* Most Viewed Category */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Top Section
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">Most Viewed Category</h4>
                    </div>
                  </div>
                </div>

                {data?.mostViewedCategory ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xl font-extrabold text-slate-900">
                      {data.mostViewedCategory.name}
                    </p>
                    <p className="text-xs font-semibold text-indigo-600 mt-1">
                      {data.mostViewedCategory.views} category views
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                    Not enough category data collected yet.
                  </div>
                )}
              </div>
            </div>

            {/* Explanation Note */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <BarChart2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">How analytics are measured:</span>
                Menu views increment each time your digital menu URL is loaded. QR scans specifically track customers who scanned your printed table standees. Item views increment when diners tap on dishes to view details.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

