import React, { useEffect, useRef, useState } from 'react';
import { Printer, ArrowLeft, Wifi, Sparkles, Smartphone, Utensils, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';
import { getMenuUrl } from '../utils/menuUrl';

const QrPrint = () => {
  const { restaurant } = useAuth();
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [cardStyle, setCardStyle] = useState('standee'); // 'standee', 'minimal', 'badge'
  const [tableNumber, setTableNumber] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifi, setShowWifi] = useState(false);

  const qrTargetUrl = restaurant ? getMenuUrl(restaurant.slug, { source: 'qr' }) : '';

  useEffect(() => {
    if (!qrTargetUrl || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      qrTargetUrl,
      {
        width: 360,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      },
      (err) => {
        if (err) setError('Could not generate QR code for print');
      }
    );
  }, [qrTargetUrl]);

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-16">
      {/* Print-only CSS rules */}
      <style>{`
        @media print {
          @page {
            margin: 0.25in;
            size: auto;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            min-height: 100vh !important;
          }
          .print-area {
            box-shadow: none !important;
            border: 2px solid #0f172a !important;
            page-break-inside: avoid !important;
            width: 100% !important;
            max-width: 4.5in !important;
          }
        }
      `}</style>

      {/* Screen Toolbar */}
      <header className="no-print glass-header sticky top-0 z-50 border-b border-slate-200 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/qr-code"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </Link>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="text-xs font-semibold text-slate-500">Print Preview Station</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn-glow flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-sm shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" />
            Print Now
          </button>
        </div>
      </header>

      {/* Screen Customizer Controls Bar */}
      <div className="no-print max-w-2xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Card Layout:</span>
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setCardStyle('standee')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  cardStyle === 'standee' ? 'bg-white shadow-xs text-orange-600' : 'text-slate-600'
                }`}
              >
                Table Tent
              </button>
              <button
                onClick={() => setCardStyle('minimal')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  cardStyle === 'minimal' ? 'bg-white shadow-xs text-orange-600' : 'text-slate-600'
                }`}
              >
                Minimal
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-bold text-slate-700">Table #:</label>
            <input
              type="text"
              placeholder="e.g. 05 (optional)"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-28 px-2.5 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={showWifi}
                onChange={(e) => setShowWifi(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              Include Guest Wi-Fi
            </label>
          </div>
        </div>

        {showWifi && (
          <div className="mt-2 bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-3 text-xs animate-fade-in">
            <Wifi className="w-4 h-4 text-orange-500 shrink-0" />
            <input
              type="text"
              placeholder="Wi-Fi SSID (Name)"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 flex-1 text-xs"
            />
            <input
              type="text"
              placeholder="Wi-Fi Password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 flex-1 text-xs"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="no-print max-w-md mx-auto mt-4 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
          {error}
        </div>
      )}

      {/* Printable Paper Card Container */}
      <div className="print-container flex items-center justify-center py-10 px-4">
        <div
          className={`print-area bg-white rounded-3xl border-2 border-slate-900 shadow-2xl w-full max-w-md p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300 ${
            cardStyle === 'minimal' ? 'border-slate-300' : ''
          }`}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-900/40" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-900/40" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-900/40" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-900/40" />

          {/* Table Number Badge */}
          {tableNumber.trim() && (
            <div className="mb-4 inline-flex items-center gap-1 bg-slate-900 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              Table #{tableNumber.trim()}
            </div>
          )}

          {/* Restaurant Logo & Header */}
          {restaurant?.logo ? (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              {restaurant?.name?.[0]?.toUpperCase() || 'M'}
            </div>
          )}

          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
            {restaurant?.name || 'Restaurant Name'}
          </h2>

          <div className="my-3 flex items-center justify-center gap-2">
            <span className="h-[1px] w-10 bg-slate-300" />
            <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Contactless Menu
            </span>
            <span className="h-[1px] w-10 bg-slate-300" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            SCAN TO VIEW
          </h1>

          {/* QR Code Canvas */}
          <div className="my-5 p-3.5 bg-white border-2 border-dashed border-slate-300 rounded-2xl inline-flex items-center justify-center shadow-xs">
            <div className="w-[170px] h-[170px] max-w-full aspect-square flex items-center justify-center">
              {qrTargetUrl ? (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain rounded-lg aspect-square block"
                  style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
                />
              ) : (
                <div className="w-full h-full border border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs">
                  QR Code
                </div>
              )}
            </div>
          </div>

          {/* 3 Step Instruction Guide */}
          <div className="grid grid-cols-3 gap-2 text-center text-slate-600 mb-6 px-2">
            <div className="flex flex-col items-center">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold text-[10px] flex items-center justify-center mb-1">
                1
              </span>
              <span className="text-[10px] font-semibold leading-tight">Open Camera</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold text-[10px] flex items-center justify-center mb-1">
                2
              </span>
              <span className="text-[10px] font-semibold leading-tight">Point at QR</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold text-[10px] flex items-center justify-center mb-1">
                3
              </span>
              <span className="text-[10px] font-semibold leading-tight">Browse & Enjoy</span>
            </div>
          </div>

          {/* Guest Wi-Fi Section */}
          {showWifi && (wifiName || wifiPassword) && (
            <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-3 text-left">
              <Wifi className="w-4 h-4 text-slate-700 shrink-0" />
              <div className="text-[11px] leading-tight">
                {wifiName && <div><span className="font-bold text-slate-900">Wi-Fi:</span> {wifiName}</div>}
                {wifiPassword && <div><span className="font-bold text-slate-900">Pass:</span> {wifiPassword}</div>}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-xs font-semibold text-slate-400">
            Thank you for dining with us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrPrint;

