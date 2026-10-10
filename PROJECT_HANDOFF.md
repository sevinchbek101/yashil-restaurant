# YASHIL restaurant website — complete project handoff

Last documented state: **Version 9**, 2026-10-10.

## 1. Project identity

- Product name: **YASHIL**
- Purpose: a healthy-food restaurant website where customers can browse meals, search and filter the menu, build a cart, place an order, and track delivery status. An authenticated admin manages products, orders, customers, promo codes, delivery zones, and basic shop settings.
- Production URL: https://yashil-bowl-uz.apt-snipe-2429.chatgpt.site
- GitHub repository: https://github.com/sevinchbek101/yashil-restaurant
- GitHub visibility: private
- Current GitHub production snapshot branch: `version-9`
- Current GitHub main commit: `c2dc38f98a78961e00e70465e75eb260e4e9ea54`
- Current ChatGPT Sites source commit: `32a129b9ad9ae5c6266a383435b1cbc4ae0821ad`
- ChatGPT Sites project ID: `appgprj_6ac9f15ca4dc819190d3d10f464b1d16`
- Current Site access: owner-only private/custom access. Only the owner account is allowed.

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
- Sign in with ChatGPT headers are used for the protected admin page

## 3. Main routes and user experience

### `/` — storefront/landing page

- Responsive top navigation with Menu, About, Tracking, Admin, language switcher, and Cart.
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

### `/admin` — protected admin dashboard

- Server-rendered page requiring Sign in with ChatGPT.
- Admin sections:
  - Dashboard: total revenue, number of orders, average order value, customer count, seven-day sales chart, latest orders.
  - Products: create, edit, hide/show, and delete products.
  - Orders: view orders and change their statuses.
  - Customers: view email, phone, order count, and total spent.
  - Promo codes: create, edit, activate/deactivate, and delete percentage discounts.
  - Settings: shop name, phone, payment methods, minimum order; manage delivery zones and fees.
- Admin interface is currently Uzbek-only.
- Critical security note: backend admin authorization currently accepts any request with `oai-authenticated-user-id`. This is acceptable only while the Site remains owner-only. Before public or multi-user access, implement an explicit admin user ID/email allowlist or role table.

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
- Admin-authenticated actions: `save-product`, `delete-product`, `order-status`, `save-promo`, `delete-promo`, `save-zone`, `delete-zone`, `save-settings`.
- Order creation does not trust browser prices. It rereads product prices and availability from D1 before calculating subtotal, discount, fee, and total.

## 8. Seed behavior

The API calls `seed()` before reads and writes:

- If the products table is empty, six demonstration products are inserted.
- The `YASHIL10` promo, two delivery zones, and basic settings are inserted with `INSERT OR IGNORE`.
- Deleting all products intentionally will cause the sample products to return on the next API call. Change the seeding strategy before using this as a real production inventory system.

## 9. Important source files

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

## 12. Git and release convention

- `main` is the latest GitHub snapshot.
- Every completed update also receives an immutable `version-N` branch.
- Add the newest section at the top of `CHANGELOG.md`.
- Update README's current version and feature summary.
- Use clear commits such as `Version 10: improve responsive navigation`.
- Do not rewrite or force-push historical version branches.
- Do not commit generated deployment tar files, `.sites-runtime`, `.wrangler`, `node_modules`, or credentials.

## 13. Highest-priority next work

1. Perform a deliberate responsive-design pass, especially the crowded navigation between 760 px and 1100 px.
2. Add explicit admin authorization before making the Site public or inviting other viewers.
3. Separate customer access from admin access so a real restaurant site can be public while `/admin` remains restricted.
4. Add product quantities and consolidate duplicate cart rows.
5. Use shop settings dynamically instead of hardcoded phone/payment/minimum order values.
6. Add robust network error UI and make loading states exit cleanly after failed requests.
7. Add multilingual database fields for product name/description or a translation table.
8. Replace image URL-only admin editing with image upload/storage.
9. Add order notes, delivery phone, and clearer payment-state handling if required.
10. Add automated unit/API tests and responsive browser tests.

## 14. Known limitations and cautions

- The live Site is private, so normal restaurant customers cannot currently open it without access.
- Payment integrations are not implemented.
- Admin authorization is generic signed-in-user authorization, not role-based authorization.
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

