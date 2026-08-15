// Shared theme lookup tables — used by both the owner's theme settings page
// (for the live preview) and the public menu (for actual rendering), so the
// preview always matches what customers really see.

// Font choices are applied via inline style rather than Tailwind classes,
// since they aren't part of the Tailwind config and inline style always
// works regardless of the build's class-scanning.
export const FONT_STACKS = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  rounded: "'Varela Round', 'Trebuchet MS', ui-rounded, sans-serif",
};

export const FONT_LABELS = {
  sans: 'Sans-serif',
  serif: 'Serif',
  rounded: 'Rounded',
};

// Page-level background + text color combo per background style.
// Written out as full literal class strings (not built dynamically) so
// Tailwind's class scanner always picks them up.
export const BACKGROUND_CLASSES = {
  white: { page: 'bg-gray-50', text: 'text-gray-900', subtext: 'text-gray-500' },
  soft: { page: 'bg-orange-50', text: 'text-gray-900', subtext: 'text-gray-500' },
  dark: { page: 'bg-gray-900', text: 'text-white', subtext: 'text-gray-400' },
};

export const BACKGROUND_LABELS = {
  white: 'Light',
  soft: 'Soft',
  dark: 'Dark',
};

// Card surface + border/shadow treatment per card style, split by whether
// the page background is dark (cards need a dark surface too) or light.
export const CARD_CLASSES = {
  rounded: {
    light: 'bg-white rounded-xl shadow-sm border border-gray-100',
    dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-700',
  },
  minimal: {
    light: 'bg-white rounded-none border-b border-gray-200',
    dark: 'bg-gray-900 rounded-none border-b border-gray-700',
  },
  bordered: {
    light: 'bg-white rounded-lg border-2 border-gray-200',
    dark: 'bg-gray-800 rounded-lg border-2 border-gray-700',
  },
};

export const CARD_STYLE_LABELS = {
  rounded: 'Rounded',
  minimal: 'Minimal',
  bordered: 'Bordered',
};

// The 3 one-click presets from the product spec. Picking one fills in
// sensible defaults for the 4 underlying fields, which the owner can then
// fine-tune individually.
export const THEME_PRESETS = {
  classic: {
    label: 'Classic',
    description: 'Warm and traditional restaurant-style menu.',
    primaryColor: '#c2410c',
    backgroundStyle: 'white',
    font: 'serif',
    cardStyle: 'bordered',
  },
  modern: {
    label: 'Modern',
    description: 'Clean, minimal, contemporary.',
    primaryColor: '#2563eb',
    backgroundStyle: 'white',
    font: 'sans',
    cardStyle: 'rounded',
  },
  elegant: {
    label: 'Elegant',
    description: 'Premium dark appearance.',
    primaryColor: '#d4af37',
    backgroundStyle: 'dark',
    font: 'serif',
    cardStyle: 'minimal',
  },
};

// A small, curated color palette so owners get good-looking results without
// needing full color theory — plus a native color picker for anyone who
// wants a specific brand color.
export const COLOR_SWATCHES = [
  '#f97316', // orange (default)
  '#c2410c', // burnt orange
  '#dc2626', // red
  '#d4af37', // gold
  '#16a34a', // green
  '#2563eb', // blue
  '#7c3aed', // purple
  '#111827', // near-black
];

// Resolves a restaurant's theme fields into everything a component needs to
// render: className strings + a CSS custom property for the primary color.
export const resolveTheme = (restaurant) => {
  const backgroundStyle = restaurant?.backgroundStyle || 'white';
  const cardStyle = restaurant?.cardStyle || 'rounded';
  const font = restaurant?.font || 'sans';
  const primaryColor = restaurant?.primaryColor || '#f97316';

  const bg = BACKGROUND_CLASSES[backgroundStyle] || BACKGROUND_CLASSES.white;
  const cardVariant = backgroundStyle === 'dark' ? 'dark' : 'light';
  const cardClasses = (CARD_CLASSES[cardStyle] || CARD_CLASSES.rounded)[cardVariant];

  return {
    pageClass: `${bg.page} ${bg.text}`,
    textClass: bg.text,
    subtextClass: bg.subtext,
    cardClass: cardClasses,
    fontFamily: FONT_STACKS[font] || FONT_STACKS.sans,
    primaryColor,
    isDark: backgroundStyle === 'dark',
  };
};
