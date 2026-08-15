import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Eye, EyeOff, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg-subtle flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 relative z-10 animate-scale-in">
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Log in to manage your menu, table QR codes, and analytics.
          </p>
        </div>

        {error && (
          <div className="mb-5 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-3.5 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
              placeholder="chef@restaurant.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-xs"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              <span>{submitting ? 'Logging in...' : 'Sign In to Dashboard'}</span>
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Don&apos;t have a menu account yet?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

