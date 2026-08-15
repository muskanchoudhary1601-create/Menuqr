# MenuQR — Phase 1 through 9 (feature-complete MVP)

Digital menu + QR code SaaS for restaurants. This build includes every
phase from the original spec: **Phase 1** (project setup, auth, dashboard),
**Phase 2** (restaurant profile + logo/cover image upload), **Phase 3**
(menu categories), **Phase 4** (menu items), **Phase 5** (the public
digital menu), **Phase 6** (QR code generation + a printable page),
**Phase 7** (menu themes), **Phase 8** (basic analytics), and **Phase 9**
(subscription-plan architecture). No payment gateway is wired in yet —
Phase 9 is the plan/limit *architecture* the spec asked for, ready for a
real gateway to plug into later.

## What's included

**Phase 1**
- React + Vite frontend (Tailwind CSS, React Router, Axios, Lucide icons)
- Express backend (Helmet, CORS, rate limiting, cookie-based JWT auth)
- MongoDB connection via Mongoose
- `User` and `Restaurant` models
- Registration (auto-creates the owner's restaurant + unique slug)
- Login / Logout
- Protected `/dashboard` route (frontend + backend)
- Basic, professional landing/auth/dashboard UI

**Phase 2**
- `/restaurant` profile page: name, description, address, phone, WhatsApp,
  Instagram URL, Google Maps URL, opening hours
- Logo + cover image upload via Multer (in-memory) → Cloudinary
- Old logo/cover images are automatically deleted from Cloudinary when
  replaced
- 5MB file size limit + image-type validation (JPG/PNG/WEBP only)
- All restaurant endpoints are scoped to `req.user` from the JWT — a
  restaurant ID is never trusted from the frontend

**Phase 3**
- `/menu/categories` page: add, rename, delete, reorder (up/down), and
  enable/disable categories
- Disabled categories stay in the database (not deleted) but are meant to be
  hidden from the public menu once that page is built
- Category names are unique per restaurant
- Reordering updates all affected categories in a single `bulkWrite`, with
  an optimistic UI update that reverts if the request fails
- Dashboard's "Categories" stat now shows a live count and links to this page

**Phase 4**
- `/menu/items` page: add, edit, delete menu items with name, description,
  price, category, photo, veg/non-veg indicator, availability, and featured
  status
- Search (by name) and filter (by category), both hitting the backend
- Mark an item **unavailable** without deleting it (for when a dish runs
  out) — shown as a toggle on each item card
- Mark an item **featured** — shown as a star toggle + badge on its image
- Every item is validated against the restaurant's own categories — a
  category id from another restaurant is rejected
- Item photos upload straight to Cloudinary the same way logo/cover do;
  the old photo is deleted automatically when replaced
- Dashboard's "Menu Items" stat now shows a live count and links to this page

**Phase 5**
- `/menu/:restaurantSlug` — the public digital menu, no login required
- Header shows logo, cover image, name, description, address, opening
  hours, and quick links (call, Instagram, directions)
- Horizontal scrolling category nav that jumps to each section
- Client-side search across name + description — instant, no extra network
  requests once the menu is loaded
- Disabled categories and their items never appear; unavailable items still
  show (so customers see the full menu) but are visually dimmed with a
  "Currently unavailable" overlay
- Dedicated states for: loading, restaurant not found (invalid QR/URL), an
  empty menu, and no search results
- Dynamic page `<title>` and meta description per restaurant (SEO)
- Rate-limited (120 requests/minute) since this endpoint has no auth
- Dashboard's "View Menu" button now opens the real public menu in a new tab

**Phase 6**
- `/qr-code` — generates a QR code that encodes the restaurant's public menu
  URL (`<domain>/menu/<slug>`), entirely client-side via the `qrcode`
  library
- Because the code only encodes the URL (never a menu snapshot), it stays
  valid forever, even as items/prices/categories change later
- **Download PNG** and **Download SVG** buttons
- Copy-to-clipboard for the raw menu link
- `/qr-code/print` — a print-optimized page (logo, "SCAN TO VIEW MENU", the
  code, "Thank you for visiting!") with dedicated print CSS that hides the
  toolbar and centers the card on the printed page
- Dashboard's "Download QR" button and the navbar now link here

**Phase 7**
- `/theme` — pick one of 3 presets (**Classic**, **Modern**, **Elegant**),
  then fine-tune: primary color (8 curated swatches + a native color
  picker), background (Light/Soft/Dark), font (Sans/Serif/Rounded), and
  card style (Rounded/Minimal/Bordered)
- Live preview panel on the settings page mirrors the real public menu
  styling, so changes are visible before saving
- The public menu (`/menu/:slug`) now renders using the restaurant's saved
  theme — header, category chips, cards, prices, and background all pick up
  the primary color, font, and card treatment
- Dark background automatically flips card surfaces and text to readable
  light-on-dark, so "Elegant" looks intentional rather than broken

**Phase 8**
- `/analytics` — Menu Views, QR Scans, Most Viewed Item, Most Viewed
  Category, all pulled from lightweight events the public menu fires
- **Menu view**: recorded once per page load of `/menu/:slug`
- **QR scan**: recorded when the page load came from the actual QR code —
  the QR image/print page encode the menu URL with `?source=qr`, so a scan
  is told apart from someone sharing the plain link. The dashboard's "View
  Menu" and the copy-link button both use the untagged URL, so previewing
  your own menu never inflates scan counts
- **Category view** / **item view**: recorded when a customer taps a
  category chip or a food card on the public menu
- All tracking calls are fire-and-forget from the browser — they never
  block rendering and silently no-op on failure
- Every event is validated server-side against the restaurant it claims to
  belong to, so bad/tampered ids can't pollute another restaurant's data
- Dashboard's "Menu Views" and "QR Scans" stat cards are now live and link
  to the Analytics page

**Phase 9**
- `server/config/plans.js` — the single source of truth for what Free
  (₹0), Pro (₹199), and Business (₹499) each include, mirroring the
  pricing table in the product spec
- **No payment gateway is wired in.** Switching plans is a placeholder that
  assigns the plan directly — this is intentional per the spec
  ("subscription-ready architecture", not live billing) and marks exactly
  where a real Stripe/Razorpay checkout would plug in later
- The one concrete limit enforced end-to-end: **Free is capped at 30 menu
  items.** Creating a 31st item on Free returns a clear error with an
  upgrade prompt; Pro/Business are unlimited
- Downgrading to Free is blocked if you currently have more items than the
  Free limit allows, so you can't end up in a broken state
- `Subscription` model — an append-only history of plan changes (what a
  real billing webhook would write into), separate from
  `Restaurant.subscriptionPlan`, which is the fast "what plan are they on"
  read used by limit checks
- `/billing` — shows current plan, item usage against the limit, and lets
  the owner switch plans (with a clear "no payment collected yet" note)
- Landing page now has a real pricing section (Free/Pro/Business cards)
  matching the spec
- Public menu's "Powered by MenuQR" footer is now hidden for Pro/Business
  restaurants (branding removal, per the Pro plan's feature list)

## Folder structure

```
menuqr/
├── client/          React + Vite frontend
│   └── src/
│       ├── components/   Navbar, ProtectedRoute
│       ├── context/       AuthContext (global auth state)
│       ├── pages/          Landing, Register, Login, ForgotPassword, Dashboard,
│       │                    RestaurantProfile, MenuCategories, MenuItems,
│       │                    PublicMenu, QrCodePage, QrPrint, ThemeSettings,
│       │                    Analytics, Billing
│       ├── services/      Axios instance
│       └── utils/          menuUrl.js, themeStyles.js, trackView.js
├── server/          Express backend
│   ├── config/       MongoDB connection, Cloudinary config, plans.js
│   ├── controllers/  authController.js, restaurantController.js, categoryController.js, menuItemController.js, publicController.js, analyticsController.js, billingController.js
│   ├── middleware/    authMiddleware.js, errorMiddleware.js, uploadMiddleware.js, handleUpload.js
│   ├── models/        User.js, Restaurant.js, Category.js, MenuItem.js, MenuView.js, Subscription.js
│   ├── routes/         authRoutes.js, restaurantRoutes.js, categoryRoutes.js, menuItemRoutes.js, publicRoutes.js, analyticsRoutes.js, billingRoutes.js
│   └── utils/          generateToken.js, slugify.js, uploadToCloudinary.js, getOwnedRestaurant.js
├── .env.example
└── .gitignore
```

## 1. Files created & what they do

**Server**
- `server.js` — entry point; connects to MongoDB, then starts Express.
- `app.js` — Express app: security middleware, CORS, routes, error handlers.
- `config/db.js` — Mongoose connection logic.
- `models/User.js` — owner account; hashes password with bcrypt on save.
- `models/Restaurant.js` — one restaurant per owner (Phase 1), unique slug.
- `controllers/authController.js` — register (creates user + restaurant),
  login, logout, and `getMe` (session check).
- `routes/authRoutes.js` — `/api/auth/*` routes, with rate limiting on
  register/login.
- `middleware/authMiddleware.js` — verifies the JWT cookie and attaches
  `req.user`.
- `middleware/errorMiddleware.js` — 404 handler + centralized error responses.
- `utils/generateToken.js` — signs the JWT and sets it as an HTTP-only cookie.
- `utils/slugify.js` — turns a restaurant name into a unique URL slug.
- `config/cloudinary.js` — configures the Cloudinary SDK from env vars.
- `middleware/uploadMiddleware.js` — Multer config (memory storage, 5MB
  limit, JPG/PNG/WEBP only).
- `utils/uploadToCloudinary.js` — streams a file buffer to Cloudinary and
  deletes old images on replacement.
- `controllers/restaurantController.js` — get/update the profile, upload
  logo, upload cover. Always looks up the restaurant via `req.user._id`,
  never a client-supplied ID.
- `routes/restaurantRoutes.js` — `/api/restaurants/*`, all behind `protect`;
  wraps Multer so oversized/invalid files return clean JSON errors instead
  of crashing the request.
- `utils/getOwnedRestaurant.js` — shared helper: looks up "the current
  user's restaurant" the same safe way everywhere it's needed.
- `models/Category.js` — name, display `order`, `isEnabled`; unique per
  restaurant.
- `controllers/categoryController.js` — list/create/update/delete/reorder,
  every query scoped by `restaurantId` derived from `req.user`.
- `routes/categoryRoutes.js` — `/api/categories/*`, all behind `protect`.
- `middleware/handleUpload.js` — shared Multer error-handling wrapper, used
  by both restaurant and menu-item image uploads.
- `models/MenuItem.js` — name, description, price, category ref, image,
  `dietType` (veg/non-veg), `isAvailable`, `isFeatured`, display `order`.
- `controllers/menuItemController.js` — list (with `?category=` and
  `?search=` filters), get one, create (optional image in the same
  request), update, dedicated image upload, delete. Validates that any
  `categoryId` actually belongs to the requester's restaurant.
- `routes/menuItemRoutes.js` — `/api/menu-items/*`, all behind `protect`.
- `controllers/publicController.js` — `getPublicMenu`: looks up a restaurant
  by slug, its enabled categories, and their items, and shapes them into a
  ready-to-render menu (now including theme fields). No auth.
- `routes/publicRoutes.js` — `/api/public/menu/:slug`, rate-limited, no
  `protect`.
- `updateTheme` (in `restaurantController.js`) — validates and saves
  `theme`, `primaryColor`, `backgroundStyle`, `font`, `cardStyle`; exposed
  at `PUT /api/restaurants/theme`.
- `models/MenuView.js` — one lightweight event per row (`menu_view`,
  `qr_scan`, `category_view`, or `item_view`), scoped to a restaurant and
  optionally a category/item.
- `controllers/analyticsController.js` — `recordView` (public, called from
  the customer-facing menu) and `getAnalytics` (private, aggregates counts
  + the single most-viewed item/category for the owner's dashboard).
- `routes/analyticsRoutes.js` — `POST /api/analytics/view` (public,
  rate-limited) and `GET /api/analytics` (protected).
- `config/plans.js` — plan definitions (Free/Pro/Business): price, item
  limit, branding removal, and the feature list shown on pricing UI.
- `models/Subscription.js` — append-only record of plan changes, separate
  from the fast `Restaurant.subscriptionPlan` read.
- `controllers/billingController.js` — `getMyPlan` (usage + all plans) and
  `changePlan` (placeholder plan switch — no payment gateway yet).
- `routes/billingRoutes.js` — `GET /api/billing/plan`,
  `POST /api/billing/upgrade`, both protected.

**Client**
- `src/services/api.js` — shared Axios instance (`withCredentials: true` so
  the auth cookie is sent).
- `src/context/AuthContext.jsx` — global auth state (`user`, `restaurant`)
  and `register`/`login`/`logout` actions.
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if not
  authenticated.
- `src/components/Navbar.jsx` — top nav, changes based on auth state.
- `src/pages/Landing.jsx` — `/` marketing page.
- `src/pages/Register.jsx` — `/register` form.
- `src/pages/Login.jsx` — `/login` form.
- `src/pages/ForgotPassword.jsx` — `/forgot-password` placeholder (full flow
  comes later).
- `src/pages/Dashboard.jsx` — `/dashboard`, protected, shows restaurant +
  menu URL + placeholder stats, with a link to Edit Profile.
- `src/pages/RestaurantProfile.jsx` — `/restaurant`, protected. Edits profile
  fields and uploads logo/cover (each uploads immediately on selection).
- `src/pages/MenuCategories.jsx` — `/menu/categories`, protected. Add,
  rename, delete, reorder, and enable/disable categories.
- `src/pages/MenuItems.jsx` — `/menu/items`, protected. Grid of items with
  search + category filter; a modal handles add/edit including photo
  upload; inline toggles for available/featured.
- `src/pages/PublicMenu.jsx` — `/menu/:restaurantSlug`, public. What
  customers see after scanning the QR code — no Navbar, no login.
- `src/utils/menuUrl.js` — builds the public menu URL a QR code should
  encode (`VITE_PUBLIC_MENU_BASE_URL` override, or `window.location.origin`).
- `src/pages/QrCodePage.jsx` — `/qr-code`, protected. Generates + previews
  the QR code, with PNG/SVG download and copy-link.
- `src/pages/QrPrint.jsx` — `/qr-code/print`, protected. The printable
  table-tent-style page.
- `src/utils/themeStyles.js` — shared lookup tables (presets, color
  swatches, font stacks, background/card classes) used by both the theme
  settings preview and the public menu's actual rendering.
- `src/pages/ThemeSettings.jsx` — `/theme`, protected. Preset picker + fine
  controls + live preview.
- `src/utils/trackView.js` — fire-and-forget helper the public menu uses to
  send analytics events without ever blocking or erroring visibly.
- `src/pages/Analytics.jsx` — `/analytics`, protected. Menu Views, QR
  Scans, Most Viewed Item, Most Viewed Category.
- `src/pages/Billing.jsx` — `/billing`, protected. Current plan, usage vs.
  limit, and plan-switch buttons (no payment collected).

## 2. Dependencies to install

From the project root:

```bash
cd server && npm install
cd ../client && npm install
```

## 3. Environment variables

Copy the example files and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env`
| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `5000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, for CORS (`http://localhost:5173`) |
| `CLOUDINARY_CLOUD_NAME` | From your [Cloudinary](https://cloudinary.com) dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

Cloudinary has a free tier — sign up, and your cloud name/API key/secret are
shown right on the dashboard homepage. Logo/cover upload won't work until
these are filled in.

`client/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (`http://localhost:5000/api`) |
| `VITE_PUBLIC_MENU_BASE_URL` | Optional. Overrides the domain encoded into QR codes — leave blank locally (falls back to `window.location.origin`); set to your real domain once deployed |

You'll need a running MongoDB instance — either locally (`mongod`) or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

## 4. How to run the backend

```bash
cd server
npm run dev
```

You should see:
```
MongoDB connected: <host>
MenuQR API running on port 5000 [development]
```

## 5. How to run the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Open **http://localhost:5173**.

## 6. How to test registration/login

1. Go to `http://localhost:5173/register`.
2. Fill in owner name, restaurant name, email, phone, and password — submit.
   - This creates a `User`, auto-creates a `Restaurant` with a unique slug
     (e.g. `cafe-mocha`), sets an HTTP-only JWT cookie, and redirects you to
     `/dashboard`.
3. On the dashboard, you should see your restaurant name and menu URL.
4. Click **Logout** in the navbar — you'll be sent back to the app, and
   visiting `/dashboard` directly should redirect you to `/login`.
5. Go to `/login`, sign in with the same email/password — you should land
   back on `/dashboard`.

You can also test the API directly:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "ownerName": "Priya Sharma",
    "restaurantName": "Cafe Mocha",
    "email": "priya@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123"
  }'

curl http://localhost:5000/api/auth/me -b cookies.txt
```

## 7. How to test the restaurant profile (Phase 2)

1. Log in, then go to `http://localhost:5173/restaurant` (or click **Edit
   Profile** on the dashboard).
2. Fill in description, address, phone, WhatsApp, Instagram URL, Google Maps
   URL, and opening hours — click **Save Changes**. You should see a green
   "Saved" confirmation.
3. Hover the circular logo placeholder and click it (or the **Change cover**
   button on the banner) to pick an image. It uploads immediately — you'll
   see a spinner, then the image appears.
4. Refresh the page — your saved fields and images should persist (they're
   now stored in MongoDB / Cloudinary).
5. Try uploading a file over 5MB or a non-image file — you should get a
   clear error message, not a crash.

API test:

```bash
# after logging in via curl and saving cookies.txt (see Phase 1 test above)
curl -X PUT http://localhost:5000/api/restaurants/me \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"description": "Cozy neighborhood cafe", "phone": "9876543210"}'

curl -X POST http://localhost:5000/api/restaurants/logo \
  -b cookies.txt \
  -F "logo=@/path/to/logo.png"
```

## 8. How to test menu categories (Phase 3)

1. Log in, go to `http://localhost:5173/menu/categories` (or click the
   **Categories** stat / nav link).
2. Type a name (e.g. "Starters") and click **Add** — it appears in the list.
3. Add a couple more (e.g. "Pizza", "Drinks").
4. Click the pencil icon to rename one; click the checkmark to save.
5. Use the up/down arrows to reorder — refresh the page to confirm the new
   order persisted.
6. Toggle the switch to disable a category — its label turns gray with a
   "(hidden)" tag (it isn't deleted, just marked disabled for the public
   menu, which comes in a later phase).
7. Click the trash icon, then **Confirm** to delete a category.
8. Try adding two categories with the exact same name — you should get a
   clear "already exists" error.

API test:

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Starters"}'

curl http://localhost:5000/api/categories -b cookies.txt
```

## 9. How to test menu items (Phase 4)

1. Make sure you have at least one category (Phase 3) — items require one.
2. Go to `http://localhost:5173/menu/items`, click **Add Item**.
3. Fill in name, description, price, pick a category and veg/non-veg, tap
   the camera circle to add a photo, then **Add Item**. It appears in the
   grid with your photo.
4. Click the star icon on a card to mark it **Featured** — a badge appears
   on the photo.
5. Click the **Available** pill to toggle it to **Unavailable** — the item
   stays in your list (not deleted), just marked.
6. Use the search box to filter by name, and the category dropdown to
   filter by category — both should narrow the grid.
7. Click the pencil icon to edit an item (including swapping its photo),
   and the trash icon + **Confirm** to delete one.

API test:

```bash
curl -X POST http://localhost:5000/api/menu-items \
  -b cookies.txt \
  -F "name=Margherita Pizza" \
  -F "description=Classic cheese and tomato pizza" \
  -F "price=249" \
  -F "categoryId=<a category id from /api/categories>" \
  -F "dietType=veg" \
  -F "image=@/path/to/pizza.jpg"

curl "http://localhost:5000/api/menu-items?search=pizza" -b cookies.txt
```

## 10. How to test the public menu (Phase 5)

1. Make sure your restaurant has at least one enabled category with a
   couple of available items (from Phases 3–4).
2. From the dashboard, click **View Menu** — it opens `/menu/<your-slug>`
   in a new tab.
3. You should see your logo, cover image, name, description, address,
   opening hours, and the quick-action chips (Call / Instagram /
   Directions) for whichever fields you filled in.
4. Tap a category chip — the page scrolls to that section; tap **All** to
   reset.
5. Type in the search box — the grid should filter instantly with no
   network delay (open dev tools Network tab to confirm no new requests
   fire per keystroke).
6. Mark an item unavailable (from `/menu/items`) — refresh the public menu
   and confirm it now shows a dimmed "Currently unavailable" overlay
   instead of disappearing.
7. Disable a category (from `/menu/categories`) — refresh and confirm that
   category and its items no longer appear at all.
8. Visit `/menu/some-slug-that-does-not-exist` — you should see the
   friendly "Menu not found" state, not a crash.
9. Log out first, then repeat step 2's URL directly — it should load fine
   with no login required.

API test:

```bash
curl http://localhost:5000/api/public/menu/cafe-mocha
```

## 11. How to test the QR code (Phase 6)

1. Go to `http://localhost:5173/qr-code` (or click **Download QR** on the
   dashboard).
2. You should see a QR code render within a second or two, with your
   restaurant name above it and the menu link below it.
3. Scan it with your phone's camera — it should open your public menu
   (`/menu/<your-slug>`) directly.
4. Click **Download PNG** and **Download SVG** — both should download
   working image files.
5. Click the link text under the QR code to copy it — you should see a
   checkmark confirm the copy.
6. Click **Print QR** — you land on `/qr-code/print`. Click **Print** (or
   use your browser's print dialog) and check the print preview: the
   toolbar should disappear and only the card (logo, "SCAN TO VIEW MENU",
   QR code, restaurant name, "Thank you for visiting!") should show,
   centered on the page.
7. Add a new menu item, then re-scan the same QR code — it should still
   work and show the updated menu, since the code just encodes the URL.

## 12. How to test menu themes (Phase 7)

1. Go to `http://localhost:5173/theme` (or click **Theme** in the navbar).
2. Click each preset (**Classic**, **Modern**, **Elegant**) — the color,
   background, font, and card style controls should update to match, and
   the preview panel on the right should visibly change.
3. Pick a custom primary color from the swatches, or use the "Custom" color
   picker — the preview's accent color (chip, featured badge, price) should
   update immediately.
4. Try each background option (Light/Soft/Dark) — Dark should flip the
   preview to a dark card on a dark page with light text, not black-on-black.
5. Click **Save Theme** — you should see a green "Saved" confirmation.
6. Open your public menu (`/menu/<your-slug>`) in a new tab — it should
   match the preview: same primary color, background, font, and card style.
7. Refresh `/theme` — your saved settings should still be selected (not
   reset to defaults).

API test:

```bash
curl -X PUT http://localhost:5000/api/restaurants/theme \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"theme": "elegant", "primaryColor": "#d4af37", "backgroundStyle": "dark", "font": "serif", "cardStyle": "minimal"}'

curl http://localhost:5000/api/public/menu/cafe-mocha
```

## 13. How to test analytics (Phase 8)

1. Open your public menu in a normal tab: `http://localhost:5173/menu/<your-slug>`.
2. Go to `/analytics` — **Menu Views** should now show at least 1.
3. Back on the public menu, tap a category chip (not "All") and tap a food
   card a couple of times, then refresh `/analytics` — **Most Viewed
   Category** and **Most Viewed Item** should now show something.
4. Open `/qr-code` and note the QR image — visiting that exact encoded URL
   (it has `?source=qr` on the end) should bump **QR Scans**, while opening
   the plain `/menu/<slug>` link (no query string) should not.
5. On the dashboard, confirm **Menu Views** and **QR Scans** match what
   `/analytics` shows, and clicking either card navigates to `/analytics`.

API test:

```bash
curl -X POST http://localhost:5000/api/analytics/view \
  -H "Content-Type: application/json" \
  -d '{"slug": "cafe-mocha", "type": "menu_view"}'

curl http://localhost:5000/api/analytics -b cookies.txt
```

## 14. How to test subscription plans (Phase 9)

1. Go to `/billing` — you should see "Free" as your current plan, with
   your menu item usage shown against the 30-item limit.
2. From `/menu/items`, add items until you hit 30 total. The 31st attempt
   should fail with a clear error and an **Upgrade your plan** link.
3. On `/billing`, click **Switch to Pro** — you should see a confirmation
   message (no payment form, by design), and the usage limit should now
   show "(unlimited)".
4. Add a 31st+ item — it should now succeed.
5. Open your public menu (`/menu/<slug>`) — the "Powered by MenuQR" footer
   should now be gone (Pro removes branding).
6. Back on `/billing`, try **Switch to Free** — since you have more than 30
   items, it should be blocked with a message telling you to remove items
   first. Delete items down to 30 or fewer, then switching to Free should
   succeed, and the branding footer should reappear on the public menu.
7. Visit `/` (logged out) and scroll to the pricing section — Free/Pro/
   Business cards should match what `/billing` shows.

API test:

```bash
curl http://localhost:5000/api/billing/plan -b cookies.txt

curl -X POST http://localhost:5000/api/billing/upgrade \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"plan": "pro"}'
```

## What's next

This covers every phase from the original spec. From here, the natural
next steps (not built, and intentionally out of scope for "subscription-
ready architecture") would be: wiring a real payment gateway (Stripe/
Razorpay) into `billingController.js`'s `changePlan` function, multi-
restaurant support for the Business tier, staff/team accounts, and
production deployment hardening (HTTPS, environment secrets, a real
domain for `VITE_PUBLIC_MENU_BASE_URL`).
