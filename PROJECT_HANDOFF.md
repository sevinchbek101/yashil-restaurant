# YASHIL restaurant website — complete project handoff

Last documented state: **Version 12**, 2026-10-12.

## 1. Project identity

- Product name: **YASHIL**
- Purpose: a healthy-food restaurant website where customers can browse meals, search and filter the menu, build a cart, place an order, and track delivery status. An authenticated admin manages products, orders, customers, promo codes, delivery zones, and basic shop settings.
- Production URL: https://yashil-bowl-uz.apt-snipe-2429.chatgpt.site
- GitHub repository: https://github.com/sevinchbek101/yashil-restaurant
- GitHub visibility: private
- Current GitHub production snapshot branch: `version-12`
- Current GitHub main state: Version 12, identical to `version-12`
- Current ChatGPT Sites source commit: `677381028a2a090cb1056d5aa2623f2bc9d63340`
- ChatGPT Sites project ID: `appgprj_6ac9f15ca4dc819190d3d10f464b1d16`
- Current Site access: public. Customer routes are open; `/admin` and admin API actions require the dedicated admin credential and signed session cookie.

Important: the GitHub repository and the internal ChatGPT Sites source repository are separate. GitHub is used for backup and numbered version branches. Pushing GitHub does not deploy the live Site.

## 2. Current technology stack

- Node.js `>=22.13.0`
- React 19.2
- Next.js 16.3 with App Router
- Vinext 1 beta + Vite 8, deployed as a Cloudflare Worker through ChatGPT Sites
- TypeScript 5.9
- Cloudflare D1 SQLite database, binding name `DB`
- Drizzle ORM/schema and SQL migrations
- Tailwind CSS 4 is installed, but the visible custom design is mainly in `app/globals.css`
- Solar Icons React package 2.3.2, consistently using the `Broken` icon style
- Images currently load from Unsplash URLs
- Sites runtime secrets store admin credentials; Web Crypto HMAC signs a 12-hour HttpOnly/Secure/SameSite=Strict admin session cookie

## 3. Main routes and user experience

### `/` — storefront/landing page

- Shared responsive header: logo on the left, centered pill navigation on desktop, language/cart actions on the right, and a hamburger disclosure menu at 1100 px and below. Admin is intentionally absent from public navigation.
- Hero section with the YASHIL slogan, healthy-food photo, explanatory text, and menu CTA.
- Displays three sample/popular products loaded from D1.
- Add-to-cart action uses the Solar `CartPlus` icon.
- Approach/about section with four feature facts and Solar icons.
- CTA and footer.
- Side cart drawer shows selected products, total price, remove actions, and link to checkout through `/menu`.
- Limitation: the homepage cart is component state and is only copied to localStorage when the checkout link is clicked. It is not restored on homepage reload.

### `/menu` — full menu and checkout

- Loads all available products and active delivery zones from `/api/data`.
- Category filters: all, bowl, salad, drink.
- Real-time search matches product name and description.
- Cart is persisted to localStorage under `yashil:cart`.
- Cart drawer supports adding duplicate products and removing individual lines.
- Checkout modal fields: customer name, email, phone, address, delivery zone, payment method, and promo code.
- Payment options displayed: cash, Payme, Click. There is no real payment gateway yet; the chosen method is only saved as text.
- Checkout summary label is `Summa` / `Сумма` / `Amount`, with a Solar `MoneyBag` icon.
- Submitting creates an order through `POST /api/data` and displays the order number.
- Last order ID and phone are stored in localStorage under `yashil:lastOrder` for convenient tracking.
- Animated loading indicator appears while submitting. Product placeholders appear while catalog data loads.
- Limitation: there is no quantity selector. Repeated clicks create repeated cart lines.

### `/track` — order tracking

- Requires order number and the same phone number entered at checkout.
- Prefills the most recent order details from `yashil:lastOrder` when available.
- Shows customer, order items, subtotal, discount, delivery fee, total, creation time, and status timeline.
- Status sequence: `new` → `preparing` → `delivery` → `done`; `cancelled` is separate.
- Refreshes the order status automatically every 10 seconds until done/cancelled.
- Uses Solar icons for the steps and loading feedback.
- The total breakdown and invalid legacy date handling were fixed in Version 6.

### `/admin/login` — admin sign-in

- Dedicated username/password form reached by entering `/admin` directly.
- Credentials are read from Sites runtime variables: `YASHIL_ADMIN_LOGIN`, `YASHIL_ADMIN_PASSWORD`, and `YASHIL_ADMIN_SESSION_SECRET`.
- Successful login creates a signed 12-hour HttpOnly cookie; failed credentials return 401.

### `/admin` — protected admin dashboard

- Server-rendered page requiring a valid YASHIL admin session; otherwise redirects to `/admin/login`.
- Admin sections:
  - Dashboard: total revenue, number of orders, average order value, customer count, seven-day sales chart, latest orders.
  - Products: create, edit, hide/show, and delete products.
  - Orders: view orders and change their statuses.
  - Customers: view email, phone, order count, and total spent.
  - Promo codes: create, edit, activate/deactivate, and delete percentage discounts.
  - Settings: shop name, phone, payment methods, minimum order; manage delivery zones and fees.
- Admin interface is currently Uzbek-only.
- Admin authorization verifies the signed `yashil_admin_session` cookie in both the page and admin API. Production credentials and signing secret stay in Sites runtime secrets.

## 4. Languages

- Customer-facing UI languages: Uzbek (`uz`), Russian (`ru`), English (`en`).
- Language choice is stored in localStorage as `yashil:lang`.
- UI labels and marketing copy are translated in the React components.
- Product names and descriptions come from D1 in Uzbek only; database content is not translated yet.
- Admin is Uzbek-only.

## 5. Design system

Core colors from `app/globals.css`:

- Forest green: `#00473c`
- Lime accent: `#e6ff55`
- Sage: `#d8e5d6`
- Sand: `#e8dcc6`
- Cream background: `#f4f3e7`
- Ink: `#0e150e`
- Border line: `#d6d5c9`

Style direction:

- Editorial, modern, healthy-food branding.
- Large lightweight display headings and compact bold uppercase labels.
- Rounded pill buttons, rounded cards, restrained borders, and soft natural colors.
- Solar `Broken` icons exported through `app/icons.ts`.
- Loading spinners, modal entrance, and skeleton shimmer are retained.
- Do not apply `transform` animations to the whole `<main>` or `.admin` container. Version 8 did this and caused fixed overlays to create horizontal overflow. Version 9 removed it and constrained the page/overlays to the viewport.
- Motion respects `prefers-reduced-motion`.

## 6. Data model

### `products`

- `id`, `name`, `category`, `description`, `price`, `image`, `badge`, `available`, `created_at`
- Categories currently expected by the UI: `bowl`, `salad`, `drink`.
- Price is stored as an integer in Uzbek so‘m.

### `customers`

- `id`, `name`, unique `email`, `phone`, `order_count`, `total_spent`, `created_at`
- Customer aggregation uses email as the unique key.

### `orders`

- `id`, `customer_name`, `customer_email`, `phone`, `address`
- `items` stored as JSON text containing server-selected product IDs, names, and prices
- `subtotal`, `discount`, `delivery_fee`, `total`
- `status`, `payment`, `created_at`

### `promos`

- `id`, unique uppercase `code`, percentage `percent`, `active`
- Seed promo: `YASHIL10`, 10%.

### `zones`

- `id`, `name`, `fee`, `eta`, `active`
- Seeds: Markaz and Shahar cheti.

### `settings`

- key/value store for shop name, phone, payment list, and minimum order.
- Current limitation: several storefront values are still hardcoded and do not read these settings dynamically.

## 7. API contract

All functionality currently uses `app/api/data/route.ts`.

### Public/customer GET

- `GET /api/data`
- Returns available products and active delivery zones.

### Tracking GET

- `GET /api/data?track=1&order=<id>&phone=<phone>`
- Requires both order ID and normalized phone digits.
- Returns only customer-visible order fields and parsed items.

### Admin GET

- `GET /api/data?admin=1`
- Requires an authenticated ChatGPT user header.
- Returns products, orders, customers, promos, zones, settings, and dashboard stats.

### POST actions

- `create-order` is customer-accessible.
- Admin-session-authenticated actions: `save-product`, `delete-product`, `order-status`, `save-promo`, `delete-promo`, `save-zone`, `delete-zone`, `save-settings`.
- Order creation does not trust browser prices. It rereads product prices and availability from D1 before calculating subtotal, discount, fee, and total.

## 8. Seed behavior

The API calls `seed()` before reads and writes:

- If the products table is empty, six demonstration products are inserted.
- The `YASHIL10` promo, two delivery zones, and basic settings are inserted with `INSERT OR IGNORE`.
- Deleting all products intentionally will cause the sample products to return on the next API call. Change the seeding strategy before using this as a real production inventory system.

## 9. Important source files

- `app/site-header.tsx`: shared desktop/mobile customer header; it intentionally contains no admin link.
- `app/admin-auth.ts`: credential comparison, signed-session creation, and verification.
- `app/admin/login/`: responsive login page and client form.
- `app/api/admin-auth/route.ts`: login and logout cookie endpoint.
- `app/storefront.tsx`: home page and home cart.
- `app/menu/catalog.tsx`: full menu, search, filters, cart, checkout.
- `app/track/tracker.tsx`: tracking lookup and timeline.
- `app/admin/panel.tsx`: entire admin client interface.
- `app/api/data/route.ts`: API, seed logic, order creation, and admin mutations.
- `app/chatgpt-auth.ts`: Sign in with ChatGPT helpers.
- `app/language.tsx`: three-language state and switcher.
- `app/icons.ts`: centralized Solar Broken icon exports.
- `app/globals.css`: main design and responsive styles.
- `db/schema.ts`: Drizzle schema.
- `drizzle/0000_striped_prism.sql`: first D1 migration.
- `.openai/hosting.json`: Sites project identity and D1 binding.
- `package.json`: commands and dependencies.

The large `components/ui/` directory is starter/shadcn infrastructure and most files are not used by the current YASHIL interface. Avoid refactoring it unless a feature needs it.

## 10. Local development

Prerequisites:

- Node.js 22.13 or newer
- npm
- Git

Commands:

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run db:generate
```

For D1 local use, follow the migration instructions in the starter documentation and apply migrations to Wrangler's local state. The development environment can simulate ChatGPT sign-in only under the starter's supported portable local profile.

Always verify:

- `/` at desktop and mobile widths
- `/menu` search, categories, cart persistence, modal fields, and submission loading state
- `/track` success, invalid lookup, and auto refresh
- `/admin` authentication, CRUD actions, status changes, and responsive tables/cards
- no horizontal scrollbar with the cart closed or open
- reduced-motion mode

## 11. Version history

- Version 1: initial landing page, food cards, cart, checkout form.
- Version 2: protected admin panel and Cloudflare D1.
- Version 3: customer order tracking and periodic refresh.
- Version 4: dedicated `/menu` page and category filters.
- Version 5: Uzbek/Russian/English UI and menu search.
- Version 6: Solar Broken icon system, tracking date/timeline fixes, price breakdown.
- Version 7: replaced plain plus on add-to-cart with `CartPlus` icon.
- Version 8: `Summa`/money icon, loaders, skeletons, and transitions.
- Version 9: fixed horizontal overflow caused by page-level transform animation; kept safe loaders and icons.
- Version 10: added Antigravity handoff and agent documentation.
- Version 11: added the shared responsive header and explicit owner-only admin authorization.
- Version 12: removed public admin links, added dedicated secret-backed admin login/session, pill category states, Manrope typography, and readable line spacing.

## 12. Git and release convention

- `main` is the latest GitHub snapshot.
- Every completed update also receives an immutable `version-N` branch.
- Add the newest section at the top of `CHANGELOG.md`.
- Update README's current version and feature summary.
- Use clear commits such as `Version 10: improve responsive navigation`.
- Do not rewrite or force-push historical version branches.
- Do not commit generated deployment tar files, `.sites-runtime`, `.wrangler`, `node_modules`, or credentials.

## 13. Highest-priority next work

1. Replace the temporary shared admin password with a strong unique password before real operation.
2. Continue the broader visual-design pass for hero, cards, checkout, tracking, and admin surfaces.
3. Add product quantities and consolidate duplicate cart rows.
4. Use shop settings dynamically instead of hardcoded phone/payment/minimum order values.
5. Add robust network error UI and make loading states exit cleanly after failed requests.
6. Add multilingual database fields for product name/description or a translation table.
7. Replace image URL-only admin editing with image upload/storage.
8. Add order notes, delivery phone, and clearer payment-state handling if required.
9. Add automated unit/API tests and responsive browser tests.
10. After the current site is finished, create a separate PHP implementation; no database choice has been made yet.

## 14. Known limitations and cautions

- Payment integrations are not implemented.
- Admin access currently uses one temporary shared credential, not multiple users, roles, lockout, or database-backed access control.
- No inventory counts, modifier options, product quantities, tax logic, refunds, courier accounts, or notifications.
- Tracking is polling-based, not push/WebSocket-based.
- Product content is not multilingual.
- External Unsplash images can change or fail; production assets should eventually be stored under project control.
- The initial SQL migration uses a quoted `CURRENT_TIMESTAMP` default, while new orders explicitly save `datetime('now')`. Preserve the explicit insert behavior and use a corrective migration if the schema is cleaned up.
- The API is a single route file; split it into modules before it grows substantially.

## 15. Definition of done for future changes

A change is complete only when:

- requested behavior works on relevant routes;
- the build passes;
- desktop and mobile layouts remain intact;
- no horizontal overflow is introduced;
- customer strings are complete in all three languages;
- server-side price and authorization rules remain safe;
- README and CHANGELOG are updated;
- GitHub `main` and the next `version-N` branch point to the same verified commit;
- production is deployed separately through Sites when the change affects the live website.

