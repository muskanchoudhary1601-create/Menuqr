import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Utensils,
  Clock,
  Printer,
  Flame,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MOCK_ITEMS = {
  bestsellers: [
    { name: 'Truffle Mushroom Risotto', price: '₹420', diet: 'veg', img: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=300&auto=format&fit=crop&q=80', desc: 'Arborio rice, black truffle oil, wild mushrooms' },
    { name: 'Wood-Fired Margherita', price: '₹349', diet: 'veg', img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&auto=format&fit=crop&q=80', desc: 'San Marzano tomatoes, fresh basil, buffalo mozzarella' },
    { name: 'Crispy Butter Garlic Prawns', price: '₹520', diet: 'non-veg', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&auto=format&fit=crop&q=80', desc: 'Jumbo prawns tossed in garlic butter herb glaze' },
  ],
  pizza: [
    { name: 'Classic Pepperoni Feast', price: '₹499', diet: 'non-veg', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&auto=format&fit=crop&q=80', desc: 'Loaded with spicy cured pepperoni & hot honey' },
    { name: 'Quattro Formaggi', price: '₹449', diet: 'veg', img: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=300&auto=format&fit=crop&q=80', desc: 'Mozzarella, Gorgonzola, Fontina, Parmesan' },
  ],
  drinks: [
    { name: 'Smoked Citrus Berry Mocktail', price: '₹220', diet: 'veg', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80', desc: 'Cold pressed berries, rosemary smoke, tonic' },
    { name: 'Iced Spanish Latte', price: '₹190', diet: 'veg', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80', desc: 'Espresso with condensed milk & crushed ice' },
  ],
};

const FAQS = [
  {
    q: 'Do customers need to download any mobile app to view our menu?',
    a: 'No app download is needed! Diners simply point their phone camera at the table QR code, and the interactive web menu opens instantly on Chrome, Safari, or any browser.',
  },
  {
    q: 'How fast do price changes and 86\'d (unavailable) items update?',
    a: 'Instantly in real-time. When you update a price or toggle an item off from your dashboard, the change reflects immediately for anyone viewing or scanning your menu.',
  },
  {
    q: 'Can I print QR codes on my regular desktop printer?',
    a: 'Yes! MenuQR provides a built-in Print Studio with pre-sized Table Tent Cards, Coaster Badges, and A4 Posters ready for one-click printing on any printer.',
  },
  {
    q: 'Can I customize the colors, logos, and fonts to match my restaurant brand?',
    a: 'Absolutely. Choose from curated design themes (Classic, Modern, Elegant, Dark Neon) and customize your brand colors, cover photos, and typography.',
  },
];

const Landing = () => {
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [annualBilling, setAnnualBilling] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const plans = [
    {
      key: 'free',
      label: 'Free Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      desc: 'Perfect for cafes and food trucks getting started.',
      features: ['1 Restaurant', 'Up to 30 menu items', 'Unlimited scans', 'High-res QR Code PNG & SVG', 'Mobile-friendly menu'],
      highlighted: false,
    },
    {
      key: 'pro',
      label: 'Professional',
      monthlyPrice: 199,
      annualPrice: 159,
      desc: 'Everything you need for busy restaurants and bistros.',
      features: [
        'Unlimited menu items & categories',
        'High-resolution food photos',
        'Custom brand colors & fonts',
        'Real-time item availability toggle',
        'Chef special & bestseller badges',
        'Analytics & scan reporting',
        'No MenuQR branding',
      ],
      highlighted: true,
    },
    {
      key: 'business',
      label: 'Multi-Outlet',
      monthlyPrice: 499,
      annualPrice: 399,
      desc: 'Designed for restaurant chains and hospitality groups.',
      features: [
        'Multiple restaurant locations',
        'Staff management accounts',
        'Advanced conversion analytics',
        'Custom domain support',
        'Dedicated VIP onboarding',
        '24/7 Priority support',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 mesh-bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/60 text-orange-800 text-xs font-bold mb-6 shadow-xs animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Next-Gen QR Dining Experience</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-orange-600 font-semibold">Zero App Download</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Turn your menu into an{' '}
                <span className="gradient-text-orange">interactive QR experience</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Give your diners mouth-watering photos, instant dietary filters, and seamless mobile browsing. Update prices and specials in seconds without reprinting paper menus.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="btn-glow w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25"
                >
                  Create Your Menu Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo-section"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-300/80 bg-white/80 backdrop-blur-xs text-slate-700 hover:text-slate-900 font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Explore Live Demo
                </a>
              </div>

              {/* Trust Metrics */}
              <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">500+</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Active Restaurants</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">250k+</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Monthly Scans</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">2 Min</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Average Setup</p>
                </div>
              </div>
            </div>

            {/* Interactive Phone Mockup Simulator */}
            <div id="demo-section" className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] bg-slate-950 rounded-[44px] p-3.5 shadow-2xl ring-1 ring-slate-800 animate-float">
                {/* Phone Speaker Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-end px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Inner Screen */}
                <div className="w-full bg-white rounded-[36px] overflow-hidden text-slate-900 flex flex-col h-[560px] border border-slate-100 relative">
                  {/* Mockup Header */}
                  <div className="h-28 bg-gradient-to-r from-orange-500 to-amber-600 p-4 pt-7 text-white flex flex-col justify-between shrink-0">
                    <div className="flex justify-between items-center text-[10px] font-semibold opacity-90">
                      <span>9:41 AM</span>
                      <span>5G 100%</span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm leading-none">Bella Vista Bistro</h3>
                      <p className="text-[10px] opacity-80 mt-0.5">Italian & Modern European</p>
                    </div>
                  </div>

                  {/* Mockup Category Switcher */}
                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                    {[
                      { id: 'bestsellers', label: '🔥 Top Picks' },
                      { id: 'pizza', label: '🍕 Pizzas' },
                      { id: 'drinks', label: '🍹 Drinks' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                          activeTab === tab.id
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Mockup Food Items List */}
                  <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
                    {MOCK_ITEMS[activeTab].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2.5 p-2 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-orange-200 transition-colors"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span
                              className={`w-2.5 h-2.5 border rounded-[2px] inline-flex items-center justify-center ${
                                item.diet === 'veg' ? 'border-emerald-600' : 'border-rose-600'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  item.diet === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                          <p className="text-xs font-extrabold text-orange-600 mt-1">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Scan Callout Footer */}
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs shrink-0">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-orange-400" />
                      <span className="text-[11px] font-semibold">Try clicking the tabs!</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">● Live Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Showcase */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">
              Engineered for Modern Hospitality
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Everything your restaurant needs to delight diners
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Say goodbye to dirty, out-of-date paper menus. Elevate your brand with a smart digital experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Instant QR */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-orange-500/25">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Instant Dynamic QR Codes</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Your QR codes never expire. Update dishes, daily specials, or seasonal discounts without ever having to re-print your table standees.
              </p>
            </div>

            {/* Bento Card 2: Food Photos */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-amber-500/25">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Vibrant Food Imagery</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Dishes with high-quality photos sell up to 30% more. Showcase signature items, chef specials, and appetizing presentation.
              </p>
            </div>

            {/* Bento Card 3: Realtime Price Sync */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-emerald-500/25">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Zero-Lag Price & Stock Sync</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Sold out of a special? Mark it unavailable with one tap from your phone and prevent awkward customer ordering moments.
              </p>
            </div>

            {/* Bento Card 4: Custom Theme Studio */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-500/25">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Custom Brand Themes</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Tailor your menu with custom color palettes, serif/sans typography, and light, soft, or dark luxury aesthetics.
              </p>
            </div>

            {/* Bento Card 5: Scan Analytics */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-indigo-500/25">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Actionable Menu Analytics</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Track total menu views, QR scans, and discover your restaurant's most viewed dishes and customer preferences.
              </p>
            </div>

            {/* Bento Card 6: Print Studio */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 interactive-card">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-rose-500/25">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ready-To-Print Station</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Generate customized table tent cards, Wi-Fi stickers, and standees formatted perfectly for printing on any home or commercial printer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Annual/Monthly Switch */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Simple plans that scale with your restaurant
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Start 100% free. Upgrade anytime your menu demands it.
            </p>

            {/* Annual Billing Switch */}
            <div className="mt-6 inline-flex items-center gap-3 bg-white p-1.5 rounded-full border border-slate-200 shadow-xs">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                  !annualBilling ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                  annualBilling ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Annual <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.key}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-orange-500 relative transform lg:-translate-y-2'
                      : 'bg-white border border-slate-200 shadow-card'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      ★ Most Popular
                    </div>
                  )}

                  <div>
                    <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.label}
                    </h3>
                    <p className={`text-xs mt-1 ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.desc}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">₹{price}</span>
                      <span className={`text-xs font-medium ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                        /month {annualBilling && price > 0 ? '(billed annually)' : ''}
                      </span>
                    </div>

                    <div className="my-6 h-[1px] bg-slate-200/20" />

                    <ul className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-orange-400' : 'text-emerald-600'}`} />
                          <span className={plan.highlighted ? 'text-slate-200' : 'text-slate-700'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/register"
                    className={`mt-8 w-full text-center py-3 rounded-2xl font-bold text-xs transition-transform active:scale-98 shadow-xs ${
                      plan.highlighted
                        ? 'btn-glow bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.key === 'free' ? 'Get Started Free' : `Start with ${plan.label}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Have questions? We're here to help you get running in minutes.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-orange-500" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your restaurant experience?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
            Join hundreds of forward-thinking restaurants and cafes that delight customers every day.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25"
            >
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
            {/* Brand column */}
            <div className="space-y-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-white">
                  Menu<span className="text-orange-500">QR</span>
                </span>
              </Link>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Modern contactless QR code menus and hospitality management platform for restaurants, cafes, and bars.
              </p>
            </div>

            {/* Navigation links */}
            <div>
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="hover:text-orange-400 transition-colors">
                    Features & Studio
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-orange-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-orange-400 transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-orange-400 transition-colors">
                    Interactive Live Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">
                Solutions
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="hover:text-orange-400 transition-colors">
                    Fine Dining & Bistros
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="hover:text-orange-400 transition-colors">
                    Cafes & Coffee Shops
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-orange-400 transition-colors">
                    Multi-Outlet Franchises
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="hover:text-orange-400 transition-colors">
                    Table Standee Generator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">
                Company & Help
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="hover:text-orange-400 transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-orange-400 transition-colors">
                    Owner Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-orange-400 transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@menuqr.com" className="hover:text-orange-400 transition-colors">
                    support@menuqr.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
            <div>
              © {new Date().getFullYear()} MenuQR Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

