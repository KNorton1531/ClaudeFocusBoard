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
