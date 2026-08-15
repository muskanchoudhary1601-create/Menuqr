import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  QrCode,
  LogOut,
  LayoutDashboard,
  Store,
  Layers,
  UtensilsCrossed,
  Palette,
  BarChart3,
  CreditCard,
  Menu as MenuIcon,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, restaurant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/restaurant', label: 'Profile', icon: Store },
    { to: '/menu/categories', label: 'Categories', icon: Layers },
    { to: '/menu/items', label: 'Items', icon: UtensilsCrossed },
    { to: '/qr-code', label: 'QR Studio', icon: QrCode },
    { to: '/theme', label: 'Theme', icon: Palette },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/billing', label: 'Billing', icon: CreditCard },
  ];

  const publicNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-header sticky top-0 z-50 border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  Menu<span className="text-orange-600">QR</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">
                  Interactive Menus
                </span>
              </div>
            </Link>

            {restaurant && (
              <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate">
                  {restaurant.name}
                </span>
                {restaurant.slug && (
                  <a
                    href={`/menu/${restaurant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-orange-600 transition-colors p-1 rounded hover:bg-orange-50"
                    title="View live menu"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shrink-0 ${
                      active
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {label}
                  </Link>
                );
              })}

              <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              {publicNavLinks.map(({ to, label }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      active
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Visitor Auth Buttons (Desktop) */}
          {!user && (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-glow flex items-center gap-1.5 text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-xl shadow-sm shadow-orange-500/20 hover:brightness-110 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Create Free Menu
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1 animate-fade-in shadow-xl">
          {user ? (
            <>
              {restaurant && (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-semibold text-slate-800">{restaurant.name}</span>
                  </div>
                  <a
                    href={`/menu/${restaurant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 font-medium flex items-center gap-1"
                  >
                    View Live <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const active = isActive(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-orange-500 text-white'
                          : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                      {label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-center px-1">
                <span className="text-xs text-slate-400">Signed in as {user.ownerName || 'Owner'}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 py-1 px-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1">
                {publicNavLinks.map(({ to, label }) => {
                  const active = isActive(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        active
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-glow w-full text-center py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md shadow-orange-500/20"
                >
                  Create Free Menu
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

