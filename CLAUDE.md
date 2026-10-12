# Focus Board

A cozy, single-user focus board (React + Vite, hosted on GitHub Pages).

## Read first
Planning docs are in `docs/`. Start with `docs/00-README.md` and `docs/08-roadmap.md`.

## Rules
- Owner is a junior front-end dev. Keep code simple and readable.
- Always use full `if () {} else {}` blocks. No ternaries, no `&&` shortcuts for logic or JSX.
- One component per file. Each App/background/effect gets its own folder.
- Text and lists live in `src/content/` data files, not in components.
- Colors and sizes come from CSS variables in `src/themes/`.
- All saving and loading goes through `src/storage/storage.js`.

## How things fit together
- `src/App.jsx` holds settings and the list of Apps on the board, and saves them.
- Add an App: make a folder in `src/apps/`, then add one line to `src/apps/index.js`.
- Add a background: make a folder in `src/backgrounds/` with the picture and a `background.config.js` (copy `NightFlight/`), then add one line to `src/backgrounds/index.js`. Shared scene layers (stars, clouds, glow, smoke) are in `src/backgrounds/layers/`.
- The lofi music bar is `src/components/LofiPlayer/`. Its streams list is `src/content/lofi-streams.js`.
- Welcome message text lives in `src/content/welcome/`. The picking logic is `src/components/Welcome/pickWelcome.js` (see `docs/welcome/10-logic.md`).
