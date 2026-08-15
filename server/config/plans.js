const PLANS = {
  free: {
    key: 'free',
    label: 'Free',
    priceInr: 0,
    priceInrMonthly: 0,
    priceInrAnnual: 0,
    description: 'Perfect for small cafes & popups getting started with QR menus.',
    maxRestaurants: 1,
    maxMenuItems: 30,
    removesBranding: false,
    features: ['1 restaurant', '30 menu items', 'Basic QR code', 'Basic menu design'],
  },
  pro: {
    key: 'pro',
    label: 'Pro',
    priceInr: 199,
    priceInrMonthly: 199,
    priceInrAnnual: 1899, // ~20% discount (158/month)
    description: 'For growing restaurants needing unlimited dishes, photos & custom branding.',
    maxRestaurants: 1,
    maxMenuItems: Infinity,
    removesBranding: true,
    features: [
      'Unlimited dishes & items',
      'High-res food photos',
      'Custom branding & themes',
      'Multiple menu categories',
      'Table QR Standee generator',
      'Remove MenuQR branding',
      'Performance analytics',
    ],
  },
  business: {
    key: 'business',
    label: 'Business',
    priceInr: 499,
    priceInrMonthly: 499,
    priceInrAnnual: 4790, // ~20% discount (399/month)
    description: 'For multi-location restaurants and premium dining chains.',
    maxRestaurants: Infinity,
    maxMenuItems: Infinity,
    removesBranding: true,
    features: [
      'Multiple restaurant locations',
      'Multiple staff manager accounts',
      'Advanced real-time analytics',
      'Custom domain support',
      'Priority 24/7 dedicated support',
      'Early access to new features',
    ],
  },
};

const getPlan = (planKey) => PLANS[planKey] || PLANS.free;

const calculatePlanPrice = (planKey, billingCycle = 'monthly') => {
  const plan = getPlan(planKey);
  if (plan.key === 'free') return 0;
  return billingCycle === 'annual' ? plan.priceInrAnnual : plan.priceInrMonthly;
};

module.exports = { PLANS, getPlan, calculatePlanPrice };

