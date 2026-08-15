import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Smartphone,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Printer,
  UtensilsCrossed,
  Layers,
  Heart,
  Star,
  Flame,
  Wifi,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MOCK_DEMO_ITEMS = [
  {
    name: 'Truffle Mushroom Risotto',
    price: '₹420',
    diet: 'veg',
    tag: '⭐ Chef Special',
    img: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=300&auto=format&fit=crop&q=80',
    desc: 'Creamy arborio rice infused with black truffle glaze, parmesan & wild portobello.',
  },
  {
    name: 'Smoked Pepperoni Sourdough',
    price: '₹499',
    diet: 'non-veg',
    tag: '🔥 Bestseller',
    img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&auto=format&fit=crop&q=80',
    desc: '48-hour fermented crust topped with spicy pepperoni, hot honey drizzle & mozzarella.',
  },
  {
    name: 'Artisan Citrus Mocktail',
    price: '₹220',
    diet: 'veg',
    tag: '🍹 Fresh Pour',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    desc: 'Cold-pressed ruby grapefruit, crushed mint, rosemary smoke & sparkling tonic.',
  },
];

const HowItWorks = () => {
  const [filterDiet, setFilterDiet] = useState('all'); // 'all', 'veg', 'non-veg'
  const [selectedDish, setSelectedDish] = useState(null);

  const steps = [
    {
      step: '01',
      title: 'Build Your Menu in Minutes',
      subtitle: 'Effortless Catalog Management',
      desc: 'Add menu categories (Starters, Mains, Drinks) and dishes with descriptions, prices, dietary tags (🥬 Pure Veg, 🥩 Non-Veg), and food photos with our drag-and-drop uploader.',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '02',
      title: 'Generate & Print QR Standees',
      subtitle: 'One-Click Print Station',
      desc: 'Generate custom QR codes in seconds. Download high-res vector files or print ready-to-use Table Tent cards pre-filled with table numbers and guest Wi-Fi details.',
      icon: Printer,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Diners Scan & Explore Seamlessly',
      subtitle: 'Zero App Installs Needed',
      desc: 'Guests point their smartphone camera at the table QR code and the interactive digital menu launches instantly in their browser with search, dietary filters, and dish photos.',
      icon: Smartphone,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const filteredDishes =
    filterDiet === 'all'
      ? MOCK_DEMO_ITEMS
      : MOCK_DEMO_ITEMS.filter((item) => item.diet === filterDiet);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-14 text-center px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-bold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Simple 3-Step Setup</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto">
          How MenuQR Works <br />
          <span className="gradient-text-orange">From Setup to Scan</span>
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Learn how hundreds of cafes and restaurants modernize their dining operations in less than 5 minutes.
        </p>
      </section>

      {/* 3 Step Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-card transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200">
                      {s.step}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                    {s.subtitle}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Live Demo Simulator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" /> Interactive Sandbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Try the Live Diner Experience
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Test how your guests interact with dietary filters and dish popups in real-time.
          </p>
        </div>

        {/* Mock Phone Frame */}
        <div className="max-w-sm mx-auto bg-slate-900 p-4 rounded-[40px] shadow-2xl ring-8 ring-slate-800">
          <div className="bg-slate-50 rounded-[32px] overflow-hidden p-4 min-h-[460px] flex flex-col justify-between">
            {/* Header in Phone */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-black text-sm text-slate-900">Bistro Roma</h4>
                  <p className="text-[10px] text-slate-400">Table #4 • Verified Digital Menu</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  onClick={() => setFilterDiet('all')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    filterDiet === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setFilterDiet('veg')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    filterDiet === 'veg'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🥬 Pure Veg
                </button>
                <button
                  onClick={() => setFilterDiet('non-veg')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    filterDiet === 'non-veg'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🥩 Non-Veg
                </button>
              </div>

              {/* Dish List */}
              <div className="mt-3 space-y-2">
                {filteredDishes.map((dish, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedDish(dish)}
                    className="p-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 cursor-pointer hover:border-orange-300 transition-all"
                  >
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-xs text-slate-900 truncate">
                          {dish.name}
                        </h5>
                        <span className="font-black text-xs text-orange-600 ml-1">
                          {dish.price}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                        {dish.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-400">
              Tap any dish to open the allergen detail popup
            </div>
          </div>
        </div>

        {/* Selected Dish Popup Simulation */}
        {selectedDish && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-in">
              <img
                src={selectedDish.img}
                alt={selectedDish.name}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-slate-900">{selectedDish.name}</h4>
                <span className="font-black text-sm text-orange-600">{selectedDish.price}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedDish.desc}</p>
              <button
                onClick={() => setSelectedDish(null)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Ready to launch your restaurant’s QR menu?
        </h2>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/register"
            className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25"
          >
            Create Your Menu Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
