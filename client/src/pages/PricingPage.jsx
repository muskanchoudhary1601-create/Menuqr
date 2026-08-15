import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Building,
  Star,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const plans = [
    {
      key: 'free',
      label: 'Free Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      desc: 'Everything you need to launch a digital menu for a cafe or food truck.',
      features: [
        '1 Restaurant location',
        'Up to 30 menu items',
        'Unlimited QR code scans',
        'High-resolution QR code PNG & SVG',
        'Mobile-friendly customer menu',
        'Standard theme styling',
      ],
      highlighted: false,
      cta: 'Start Free Forever',
      link: '/register',
    },
    {
      key: 'pro',
      label: 'Pro Bistro',
      monthlyPrice: 199,
      annualPrice: 158, // billed 1899/yr
      desc: 'Our most popular tier for busy cafes, dining bistros, and restaurants.',
      features: [
        'Unlimited menu items & categories',
        'High-resolution food photos',
        'Custom brand colors, themes & typography',
        'Real-time dish availability & 86’d switches',
        'Chef special & bestseller highlight badges',
        'Table Standee & Wi-Fi card generator',
        'No MenuQR branding on customer menu',
        'Performance analytics & dish favorites',
      ],
      highlighted: true,
      cta: 'Start Pro Trial',
      link: '/register',
    },
    {
      key: 'business',
      label: 'Multi-Outlet Chain',
      monthlyPrice: 499,
      annualPrice: 399, // billed 4790/yr
      desc: 'Designed for hospitality chains, franchises, and multi-location venues.',
      features: [
        'Multiple restaurant locations',
        'Multiple staff manager accounts',
        'Advanced conversion & dwell analytics',
        'Custom domain binding support',
        'Priority 24/7 dedicated phone & WhatsApp support',
        'Early access to POS & order integrations',
      ],
      highlighted: false,
      cta: 'Get Business Plan',
      link: '/register',
    },
  ];

  const comparisonRows = [
    { feature: 'Restaurant Outlets', free: '1', pro: '1', business: 'Unlimited' },
    { feature: 'Menu Dishes & Items', free: 'Up to 30', pro: 'Unlimited', business: 'Unlimited' },
    { feature: 'Customer QR Scans', free: 'Unlimited', pro: 'Unlimited', business: 'Unlimited' },
    { feature: 'High-Res Food Photos', free: false, pro: true, business: true },
    { feature: 'Custom Theme Studio', free: 'Basic', pro: 'Full Access', business: 'Full Access' },
    { feature: 'Table Standee & Wi-Fi Station', free: true, pro: true, business: true },
    { feature: 'Remove MenuQR Watermark', free: false, pro: true, business: true },
    { feature: 'Performance Analytics', free: 'Basic', pro: 'Detailed', business: 'Advanced Multi-Branch' },
    { feature: 'Staff Multi-Accounts', free: false, pro: false, business: true },
    { feature: 'Payment Gateway Integration', free: 'Standard', pro: 'Razorpay UPI/Cards', business: 'Razorpay UPI/Cards' },
    { feature: 'Support Level', free: 'Community', pro: 'Email Support', business: '24/7 Dedicated Manager' },
  ];

  const faqs = [
    {
      q: 'Can I switch or cancel my plan anytime?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from the in-app Billing dashboard. There are no lock-in contracts.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We process payments securely via Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, NetBanking, and digital wallets.',
    },
    {
      q: 'Do you charge transaction fees on customer menu scans?',
      a: 'No! You get 100% unlimited customer scans on all plans with zero per-scan fees.',
    },
    {
      q: 'Can I start with the Free plan and upgrade later?',
      a: 'Absolutely. You can start completely free with up to 30 items and upgrade to Pro whenever you need unlimited dishes or custom branding.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-14 text-center px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-bold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto">
          Choose the perfect plan for <br />
          <span className="gradient-text-orange">your dining venue</span>
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Start for free today. Upgrade anytime as your restaurant grows.
        </p>

        {/* Annual vs Monthly Toggle */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="inline-flex items-center bg-slate-200/80 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                !annual
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                annual
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-white text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                Save ~20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const price = annual ? p.annualPrice : p.monthlyPrice;
            return (
              <div
                key={p.key}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  p.highlighted
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-orange-500 scale-[1.02]'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-xs hover:shadow-card'
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                    ★ Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight">{p.label}</h3>
                  </div>
                  <p className={`text-xs mt-2 leading-relaxed ${p.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.desc}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tight">₹{price}</span>
                    <span className={`text-xs font-bold ${p.highlighted ? 'text-slate-400' : 'text-slate-400'}`}>
                      /month
                    </span>
                  </div>
                  {annual && p.monthlyPrice > 0 && (
                    <p className="text-[11px] text-orange-400 font-bold mt-1">
                      Billed as ₹{price * 12}/year (2 months free)
                    </p>
                  )}

                  <div className={`mt-8 pt-6 border-t ${p.highlighted ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className={`text-[11px] font-extrabold uppercase tracking-wider mb-4 ${p.highlighted ? 'text-slate-400' : 'text-slate-400'}`}>
                      What’s included:
                    </p>
                    <ul className="space-y-3">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.highlighted ? 'text-orange-400' : 'text-emerald-600'}`} />
                          <span className={p.highlighted ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 pt-4">
                  <Link
                    to={p.link}
                    className={`w-full py-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                      p.highlighted
                        ? 'btn-glow bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/30 hover:brightness-110'
                        : 'bg-slate-900 text-white hover:bg-black shadow-sm'
                    }`}
                  >
                    {p.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Detailed Plan Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare all features and capacity limits across each subscription tier.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6 text-center">Free Starter</th>
                <th className="py-4 px-6 text-center text-orange-600">Pro Bistro</th>
                <th className="py-4 px-6 text-center">Business Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{row.feature}</td>
                  <td className="py-4 px-6 text-center text-slate-600">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-orange-700 bg-orange-50/30">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-900 font-bold">
                    {typeof row.business === 'boolean' ? (
                      row.business ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      row.business
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Have questions about billing, renewals, or features? We’re here to help.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-extrabold text-sm text-slate-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
