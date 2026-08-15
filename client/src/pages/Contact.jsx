import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  Building,
  Headphones,
  HelpCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    restaurantName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-12 text-center px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-bold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>We're Here For You 24/7</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto">
          Contact Our <span className="gradient-text-orange">Hospitality Team</span>
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Have questions about multi-location setups, custom enterprise themes, or need onboarding help? Let’s talk.
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-black text-xl text-slate-900">
                Get in Touch Directly
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Whether you’re running a single cafe or a franchise of 50 outlets, our restaurant success managers are ready to assist.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="mailto:support@menuqr.com"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-orange-50/50 hover:border-orange-200 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email Inquiries
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      support@menuqr.com
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      WhatsApp Quick Chat
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      +91 99999 99999 (Instant Reply)
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Support Desk Hours
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Monday – Sunday, 24/7 Coverage
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Message Received!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out, <strong>{formData.name}</strong>. One of our hospitality specialists will get in touch with you at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', restaurantName: '', email: '', phone: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Send a Message
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the details below and we’ll respond within a few hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Chef Marco"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Restaurant / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        placeholder="Trattoria Milano"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="marco@trattoria.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      How can we help? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your restaurant requirements, number of tables, or multi-branch needs..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-glow w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending Message...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
