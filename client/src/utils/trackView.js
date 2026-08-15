import api from '../services/api';

// Fires a single analytics event from the public menu. Always non-blocking
// and silent on failure — tracking should never interrupt or slow down the
// customer's experience of viewing the menu.
export const trackView = (slug, type, extra = {}) => {
  if (!slug || !type) return;
  api.post('/analytics/view', { slug, type, ...extra }).catch(() => {
    // Intentionally ignored — a dropped analytics beacon isn't worth
    // surfacing to the customer.
  });
};
