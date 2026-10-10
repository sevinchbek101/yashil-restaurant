# YASHIL agent instructions

Read `PROJECT_HANDOFF.md` before changing code. It is the authoritative project handoff.

## Product rules

- Preserve the established YASHIL visual identity: cream background, forest green, lime accents, large editorial typography, rounded controls, and Solar Icons in the `Broken` style.
- The customer UI supports Uzbek, Russian, and English. When adding customer-facing text, update all three languages in the same change.
- The admin UI is currently Uzbek-only. Do not claim that it is multilingual.
- Keep desktop and mobile layouts functional. Explicitly test at approximately 1440 px, 1024 px, 768 px, and 390 px widths.
- Do not animate a page-level ancestor that contains `.back` or `.modal`. A transform on that ancestor changes the containing block for fixed overlays and previously caused horizontal overflow.
- Motion must be subtle and placed inside `@media (prefers-reduced-motion: no-preference)`. Keep loaders informative and avoid excessive full-page skeleton repainting.
- Use icons from `app/icons.ts`. Prefer `@solar-icons/react/broken/*` so the icon style stays consistent.

## Data and security rules

- Never trust cart prices sent by the browser. Continue recalculating prices from D1 on the server.
- Tracking must continue requiring both order ID and phone number.
- The current production Site is owner-only private. If access becomes public or gains other users, replace the current generic authenticated-user admin check with an explicit owner/admin allowlist before deployment.
- Do not commit credentials, Sites write tokens, Cloudflare secrets, cookies, or personal test data.
- Database schema changes require a new ordered Drizzle migration; never edit an already-applied migration as the only migration step.

## Development workflow

1. Start from GitHub `main`; historical `version-N` branches are immutable snapshots.
2. Install with `npm ci` using Node.js 22.13 or newer.
3. Implement a focused change and preserve unrelated code.
4. Run `npm run build`. Run `npm run lint` when practical and fix only relevant issues.
5. Test `/`, `/menu`, `/track`, and `/admin`, including cart and checkout overlays.
6. Update `README.md` and add a top entry to `CHANGELOG.md` describing the change.
7. Commit to `main` and create the next `version-N` branch from that exact commit.

## Deployment warning

GitHub is the versioned backup repository, not the live ChatGPT Sites source repository. A GitHub push does not update production. The live Site must be deployed through the ChatGPT Sites workflow using project ID `appgprj_6ac9f15ca4dc819190d3d10f464b1d16`, or the project must be deliberately migrated to another host.

