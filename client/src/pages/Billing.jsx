import React, { useEffect, useState } from 'react';
import {
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  Receipt,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { loadRazorpayScript } from '../utils/razorpayLoader';

const PLAN_ORDER = ['free', 'pro', 'business'];

const Billing = () => {
  const [info, setInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [processingPlan, setProcessingPlan] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBillingData = async () => {
    try {
      const [planRes, historyRes] = await Promise.all([
        api.get('/billing/plan'),
        api.get('/billing/history'),
      ]);
      setInfo(planRes.data);
      setPayments(historyRes.data.payments || []);
      if (planRes.data.subscriptionBillingCycle) {
        setBillingCycle(planRes.data.subscriptionBillingCycle);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load billing information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleUpgrade = async (planKey) => {
    if (planKey === 'free') {
      handleDowngrade();
      return;
    }

    setError('');
    setMessage('');
    setProcessingPlan(planKey);

    try {
      // 1. Create order on server
      const { data: orderData } = await api.post('/billing/create-order', {
        plan: planKey,
        billingCycle,
      });

      // 2. If Razorpay is configured, launch checkout modal
      if (!orderData.isDemoMode) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'MenuQR SaaS',
          description: `${orderData.planLabel} Plan Subscription (${billingCycle === 'annual' ? '1 Year' : '1 Month'})`,
          image: 'https://cdn-icons-png.flaticon.com/512/7542/7542670.png',
          order_id: orderData.orderId,
          prefill: {
            name: orderData.restaurantName || '',
            email: orderData.userEmail || '',
            contact: orderData.userPhone || '',
          },
          theme: {
            color: '#f97316',
          },
          handler: async function (response) {
            try {
              setProcessingPlan(planKey);
              const verifyRes = await api.post('/billing/verify-payment', {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan: planKey,
                billingCycle,
              });

              setMessage(verifyRes.data.message || 'Payment successful! Your subscription is active.');
              await fetchBillingData();
            } catch (err) {
              setError(err.response?.data?.message || 'Payment verification failed.');
            } finally {
              setProcessingPlan('');
            }
          },
          modal: {
            ondismiss: function () {
              setProcessingPlan('');
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
          setError(`Payment failed: ${response.error.description || 'Transaction declined'}`);
          setProcessingPlan('');
        });
        paymentObject.open();
      } else {
        // Demo / Development mode (instant verification)
        const verifyRes = await api.post('/billing/verify-payment', {
          orderId: orderData.orderId,
          paymentId: `demo_pay_${Date.now()}`,
          signature: 'demo_signature',
          plan: planKey,
          billingCycle,
        });

        setMessage(verifyRes.data.message || 'Plan activated successfully (Dev/Demo Mode)!');
        await fetchBillingData();
        setProcessingPlan('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not initiate checkout');
      setProcessingPlan('');
    }
  };

  const handleDowngrade = async () => {
    setError('');
    setMessage('');
    setProcessingPlan('free');
    try {
      const { data } = await api.post('/billing/downgrade-free');
      setMessage(data.message || 'Switched to Free plan.');
      await fetchBillingData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not downgrade to Free plan');
    } finally {
      setProcessingPlan('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
          Loading subscription & payment details...
        </div>
      </div>
    );
  }

  const currentUsage = info?.usage?.menuItems ?? 0;
  const maxItems = info?.usage?.maxMenuItems ?? Infinity;
  const usagePercent = Number.isFinite(maxItems)
    ? Math.min(Math.round((currentUsage / maxItems) * 100), 100)
    : 10;

  const validUntilFormatted = info?.subscriptionValidUntil
    ? new Date(info.subscriptionValidUntil).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Subscription & Monetization
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Billing & Subscription
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your plan, process secure upgrades with Razorpay, and view payment invoices.
            </p>
          </div>

          {/* Active Plan Status Pill */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 font-medium">Current Tier: </span>
              <span className="font-extrabold text-slate-900 uppercase">
                {info?.plan?.label || 'Free'} Plan
              </span>
              {validUntilFormatted && (
                <span className="text-slate-500 ml-1.5">
                  (Renews {validUntilFormatted})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-6 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mt-6 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {/* Gateway Mode Banner */}
        {!info?.isPaymentGatewayReady && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Razorpay Test/Demo Mode Active:</strong> Add your live keys in <code>server/.env</code> to accept real UPI and card payments from diners.
              </span>
            </div>
            <a
              href="https://dashboard.razorpay.com/app/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold underline text-amber-800 hover:text-amber-900 shrink-0"
            >
              Get Razorpay Keys <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Capacity Usage Bar */}
        {info && (
          <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Capacity Meter
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {currentUsage} {Number.isFinite(maxItems) ? `of ${maxItems} dishes active` : 'dishes active (Unlimited capacity)'}
                </h3>
              </div>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
                {Number.isFinite(maxItems) ? `${usagePercent}% capacity utilized` : '∞ Unlimited Capacity'}
              </span>
            </div>

            {Number.isFinite(maxItems) && (
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}

            {Number.isFinite(maxItems) && currentUsage >= maxItems && (
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl p-3 mt-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You've reached your maximum dish capacity. Upgrade below to add unlimited dishes.</span>
              </div>
            )}
          </div>
        )}

        {/* Billing Cycle Switcher (Monthly vs Annual) */}
        <div className="mt-10 flex flex-col items-center justify-center">
          <div className="inline-flex items-center bg-slate-200/80 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'annual'
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
          <p className="text-[11px] text-slate-400 mt-2">
            {billingCycle === 'annual' ? 'Billed annually with 2 months free' : 'Billed month-to-month, cancel anytime'}
          </p>
        </div>

        {/* Pricing Tier Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {info &&
            PLAN_ORDER.map((key) => {
              const plan = info.plans[key];
              const isCurrent = info.currentPlan === key;
              const isPro = key === 'pro';
              const isBusy = processingPlan === key;

              const priceDisplay =
                plan.priceInr === 0
                  ? 0
                  : billingCycle === 'annual'
                  ? Math.round(plan.priceInrAnnual / 12)
                  : plan.priceInrMonthly;

              const billedTotal =
                billingCycle === 'annual' && plan.priceInr > 0 ? plan.priceInrAnnual : null;

              return (
                <div
                  key={key}
                  className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                    isPro
                      ? 'bg-slate-900 text-white shadow-xl ring-2 ring-orange-500'
                      : 'bg-white text-slate-900 border border-slate-200 shadow-xs hover:shadow-card'
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                      ★ Most Popular Tier
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xl tracking-tight">{plan.label}</h4>
                      {isCurrent && (
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isPro ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          Active Plan
                        </span>
                      )}
                    </div>

                    <p className={`text-xs mt-1.5 leading-relaxed ${isPro ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">₹{priceDisplay}</span>
                      <span className={`text-xs font-semibold ${isPro ? 'text-slate-400' : 'text-slate-400'}`}>
                        /month
                      </span>
                    </div>

                    {billedTotal && (
                      <p className="text-[11px] text-orange-400 font-bold mt-1">
                        Billed as ₹{billedTotal}/year
                      </p>
                    )}

                    <div className={`mt-6 pt-5 border-t ${isPro ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isPro ? 'text-slate-400' : 'text-slate-400'}`}>
                        Everything included:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-xs">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPro ? 'text-orange-400' : 'text-emerald-600'}`} />
                            <span className={isPro ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => handleUpgrade(key)}
                      disabled={isCurrent || isBusy}
                      className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrent
                          ? isPro
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-slate-100 text-slate-400 cursor-default'
                          : isPro
                          ? 'btn-glow bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-110'
                          : 'bg-slate-900 text-white hover:bg-black shadow-sm'
                      } disabled:opacity-60`}
                    >
                      {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isCurrent
                        ? 'Current Active Plan'
                        : isBusy
                        ? 'Connecting Gateway...'
                        : key === 'free'
                        ? 'Downgrade to Free'
                        : `Subscribe with Razorpay`}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Invoices & Payment History Section */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Payment & Invoice History
              </h3>
              <p className="text-xs text-slate-500">
                Records of all subscription orders, renewals, and transaction receipts.
              </p>
            </div>
            <Receipt className="w-5 h-5 text-slate-400" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {payments.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No past transactions recorded yet. When you subscribe or renew, your invoices will appear here.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Invoice #</th>
                    <th className="py-3.5 px-4">Plan & Cycle</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-bold font-mono text-slate-900">
                        {p.invoiceNumber || `INV-${p._id.slice(-6).toUpperCase()}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 capitalize">
                          {p.plan} Plan
                        </span>
                        <span className="text-slate-400 ml-1 capitalize">
                          ({p.billingCycle})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{p.amount}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            p.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'failed'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'completed'
                                ? 'bg-emerald-500'
                                : p.status === 'failed'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {p.status === 'completed'
                            ? 'Paid'
                            : p.status === 'failed'
                            ? 'Failed'
                            : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;


