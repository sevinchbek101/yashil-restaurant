# Prompt to paste into Google Antigravity

Open this repository and read `AGENTS.md`, `PROJECT_HANDOFF.md`, `README.md`, and `CHANGELOG.md` before making changes.

This is the YASHIL healthy-food restaurant website. Continue from the latest `main` branch without rewriting historical `version-N` branches. First inspect the current implementation and run the build. Then summarize the current state and propose a small plan for my next requested feature. Do not make unrelated redesigns or remove working features.

For every completed update:

1. Preserve the cream/forest/lime YASHIL design and Solar Broken icons.
2. Keep customer UI text complete in Uzbek, Russian, and English.
3. Test desktop and mobile widths, cart/checkout overlays, and confirm there is no horizontal overflow.
4. Run `npm run build`.
5. Update README and CHANGELOG.
6. Commit to `main` and create the next immutable `version-N` branch.
7. Clearly list what changed and any unresolved limitations.

Important: GitHub push does not deploy the ChatGPT Sites production URL. Prepare and commit the code, then tell me that a separate Sites deployment is required.

## Current state (Version 19)

- Splash screen added: full-screen green overlay with spinning loader and "Yuklanmoqda…" label, transitions to "Tayyor" drop-in text, minimum 1.2 s display even on fast loads. Component: `components/SplashScreen.tsx`.
- Fonts updated: `DM Sans` for body text, `Fraunces` serif for headings (h1, h2). Both loaded from Google Fonts in `globals.css`.
- `prefers-reduced-motion` respected for all splash animations.

My next task will be provided after you finish reading the project context.


