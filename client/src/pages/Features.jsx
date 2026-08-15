import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Smartphone,
  Zap,
  Palette,
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  Printer,
  ShieldCheck,
  Eye,
  Sliders,
  Share2,
  Wifi,
  Layers,
  UtensilsCrossed,
  Heart,
  TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Features = () => {
  const coreFeatures = [
    {
      icon: QrCode,
      color: 'from-orange-500 to-amber-500',
      badge: 'Zero App Installs',
      title: 'Smart Contactless QR Codes',
      desc: 'High-resolution dynamic QR codes that open instantly in Safari, Chrome, or any camera app without requiring diners to download third-party applications.',
      highlights: [
        'Vector SVG and Ultra HD PNG downloads',
        'Custom center logos & brand accents',
        'Instant menu updates without re-printing',
        'Dynamic URL routing with analytics tracking',
      ],
    },
    {
      icon: Smartphone,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Mobile-First Experience',
      title: 'Interactive Digital Menu',
      desc: 'A blazing-fast, app-like customer experience optimized for one-thumb scrolling, quick category jumps, and high-impact dish visuals.',
      highlights: [
        'Instant Pure-Veg & Non-Veg dietary filters',
        'Chef Special & Bestseller highlight badges',
        'Interactive food detail popup modals',
        'One-tap menu link sharing via WhatsApp & socials',
      ],
    },
    {
      icon: Palette,
      color: 'from-purple-500 to-pink-600',
      badge: 'Brand Customization',
      title: 'Real-Time Theme Studio',
      desc: 'Match your restaurant’s unique ambiance. Pick curated themes or customize primary brand colors, typography, and card aesthetics with instant mobile simulator previews.',
      highlights: [
        'Classic, Modern, and Elegant presets',
        'Custom hex color palette matching',
        'Serif, Sans, and Rounded typography styles',
        'Dark mode and soft ambient background options',
      ],
    },
    {
      icon: Printer,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Print Station',
      title: 'Table Standee & Tent Card Generator',
      desc: 'Generate professional printable table standees, tent cards, and coaster badges with custom table numbers and guest Wi-Fi credentials ready for one-click printing.',
      highlights: [
        'Custom Table Number labeling (Table #1 - #50)',
        'Guest Wi-Fi SSID & Password badges',
        'Standard A4 & Table Tent sizing',
        '3-Step scan instruction guide for diners',
      ],
    },
    {
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      badge: 'Live Analytics',
      title: 'Actionable Performance Metrics',
      desc: 'Understand customer dining trends, track daily QR scan volume, and discover your #1 customer favorite dishes to optimize your high-margin offerings.',
      highlights: [
        'Scan Engagement Rate % calculation',
        'Ranked customer favorite dish medals',
        'Category popularity breakdown',
        'Zero cookies required for guest privacy',
      ],
    },
    {
      icon: Zap,
      color: 'from-rose-500 to-orange-500',
      badge: 'Operations Speed',
      title: 'Instant Dish & 86’d Item Controls',
      desc: 'Ran out of a signature dish during rush hour? Toggle it unavailable with one tap in your owner dashboard — no awkward customer apologies or reprinting menus.',
      highlights: [
        'Single-click availability switch',
        'Star badge for featured dishes',
        'Drag-and-drop category reordering',
        'Grid and compact table view switcher',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg-subtle pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-bold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Everything Your Restaurant Needs To Excel</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Power your dining room with <br />
            <span className="gradient-text-orange">Next-Gen Digital Menus</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate reprinting costs, speed up table turns, and provide an exquisite contactless dining experience with interactive digital QR menus.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-glow w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/25 hover:brightness-110 transition-all"
            >
              Start Free (No Card Needed)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold bg-white text-slate-700 hover:text-slate-900 px-6 py-4 rounded-2xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {feat.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    {feat.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your restaurant’s dining experience?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Join hundreds of forward-thinking restaurants and cafes. Create your first digital menu in under 3 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn-glow inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/30"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
