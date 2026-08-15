import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen mesh-bg-subtle flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 text-center relative z-10 animate-scale-in">
        <Link to="/" className="flex items-center justify-center gap-2.5 font-black text-xl text-slate-900 mb-8 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span>
            Menu<span className="gradient-text-orange font-black">QR</span>
          </span>
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">Password Reset</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">
          Automated email reset is coming in an upcoming release. If you are locked out of your account, please reach out to MenuQR support.
        </p>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

