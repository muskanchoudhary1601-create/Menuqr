// Builds the public menu URL for a restaurant. The QR code always encodes
// this URL, never a specific menu snapshot — so it stays valid forever even
// as the owner edits categories/items/prices.
//
// Pass { source: 'qr' } to tag the URL that actually gets encoded into the
// QR image/print page, so a scan can be told apart from a plain page view
// in analytics (Phase 8). Links shown elsewhere (e.g. the dashboard's "View
// Menu" button) should use the untagged version.
export const getMenuUrl = (slug, { source } = {}) => {
  if (!slug) return '';
  const base = import.meta.env.VITE_PUBLIC_MENU_BASE_URL?.replace(/\/$/, '') || window.location.origin;
  const url = `${base}/menu/${slug}`;
  return source ? `${url}?source=${encodeURIComponent(source)}` : url;
};
