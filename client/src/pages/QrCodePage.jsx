import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Copy,
  Check,
  QrCode as QrCodeIcon,
  Sparkles,
  ExternalLink,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMenuUrl } from '../utils/menuUrl';

const QR_COLORS = [
  { label: 'Obsidian Black', dark: '#0f172a', light: '#ffffff' },
  { label: 'Ember Orange', dark: '#ea580c', light: '#ffffff' },
  { label: 'Royal Blue', dark: '#1d4ed8', light: '#ffffff' },
  { label: 'Forest Emerald', dark: '#047857', light: '#ffffff' },
  { label: 'Imperial Gold', dark: '#b45309', light: '#ffffff' },
];

const QrCodePage = () => {
  const { restaurant } = useAuth();
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(QR_COLORS[0]);
  const [pngUrl, setPngUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const menuUrl = restaurant ? getMenuUrl(restaurant.slug) : '';
  const qrTargetUrl = restaurant ? getMenuUrl(restaurant.slug, { source: 'qr' }) : '';

  useEffect(() => {
    if (!qrTargetUrl || !canvasRef.current) return;

    const options = {
      width: 512,
      margin: 2,
      color: {
        dark: selectedColor.dark,
        light: selectedColor.light,
      },
    };

    QRCode.toCanvas(canvasRef.current, qrTargetUrl, options, (err) => {
      if (err) {
        setError('Could not generate QR code');
        return;
      }
      setPngUrl(canvasRef.current.toDataURL('image/png'));
    });

    QRCode.toString(qrTargetUrl, { ...options, type: 'svg' }, (err, svg) => {
      if (!err) setSvgString(svg);
    });
  }, [qrTargetUrl, selectedColor]);

  const downloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${restaurant?.slug || 'menu'}-qr-code.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${restaurant?.slug || 'menu'}-qr-code.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('Could not copy link to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> High-Resolution Dynamic QR
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              QR Code Studio
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Never expires. Changes to your dishes or prices update automatically when customers scan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/qr-code/print"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 hover:scale-[1.02] transition-transform"
            >
              <Printer className="w-4 h-4" />
              Print Table Cards
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Preview Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-900 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300 hover:shadow-card-hover">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-900/40" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-900/40" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-900/40" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-900/40" />

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
                  Digital Table Menu
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
                      className="w-full h-full object-contain rounded-lg aspect-square block mx-auto"
                      style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <QrCodeIcon className="w-8 h-8 stroke-[1.5] mb-1" />
                      <span className="text-xs font-medium">Generating QR...</span>
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

              {/* Copy URL trigger */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200/70 text-left transition-all duration-200 group"
                >
                  <span className="text-xs text-slate-600 font-mono truncate max-w-[220px]">
                    {menuUrl}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-600 shrink-0">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        Copy
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-6 space-y-6">
            {/* Color Palette Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-slate-900">QR Code Accent Color</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Choose a high-contrast hue that matches your table decor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QR_COLORS.map((color) => {
                  const isSelected = selectedColor.dark === color.dark;
                  return (
                    <button
                      key={color.label}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-100'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-xs shrink-0"
                        style={{ backgroundColor: color.dark }}
                      />
                      <span className="text-xs font-semibold text-slate-800 flex-1">
                        {color.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export & Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-1">Export Assets</h3>
              <p className="text-xs text-slate-500 mb-4">
                Download formats for digital publishing or graphic designers.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadPng}
                  disabled={!pngUrl}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 shadow-xs active:scale-98 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Raster PNG (512px)
                </button>

                <button
                  onClick={downloadSvg}
                  disabled={!svgString}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 shadow-xs active:scale-98 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Vector SVG
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/qr-code/print"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  Open Print-Ready Studio <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Printable A4 / Standee</span>
              </div>
            </div>

            {/* Pro Tips Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Pro Tip for Restaurants
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Place your printed QR codes in acrylic standees on each table or embed them on coaster stickers. Customers scan directly without downloading any app!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;

