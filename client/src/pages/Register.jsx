import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  ownerName: '',
  restaurantName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const len = form.password.length;
    if (len === 0) return { label: '', percent: 0, color: '' };
    if (len < 6) return { label: 'Too short (min 6)', percent: 25, color: 'bg-rose-500' };
    if (len < 8) return { label: 'Fair', percent: 50, color: 'bg-amber-500' };
    if (/[A-Z]/.test(form.password) && /[0-9]/.test(form.password)) {
      return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
    }
    return { label: 'Good', percent: 75, color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg-subtle flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 relative z-10 animate-scale-in">
        {/* Brand Header */}
        <Link to="/" className="flex items-center justify-center gap-2.5 font-black text-xl text-slate-900 mb-8 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span>
            Menu<span className="gradient-text-orange font-black">QR</span>
          </span>
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your restaurant</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Launch your contactless digital menu and table QR standees in under 3 minutes.
          </p>
        </div>

        {error && (
          <div className="mb-5 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-3.5 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="Chef Arjun"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="Cafe Roma"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="owner@caferoma.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Password strength:</span>
                  <span className="font-bold">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-glow w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-orange-500/20 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{submitting ? 'Setting up restaurant...' : 'Create Free Account'}</span>
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

