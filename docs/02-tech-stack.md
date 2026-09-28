# Tech Stack (decided)

## Summary
| Part | Pick | Why |
|---|---|---|
| Frontend | **React + Vite** | Component-based, fast dev server. Confirmed. |
| Drag / resize | **react-grid-layout** | Handles drag, resize and snapping for us |
| Styling | **Plain CSS + CSS variables** | Themes become "swap a few variables" |
| Hosting (now) | **GitHub Pages** | Free, static, until feature complete |
| Saving (now) | **localStorage**, behind one `storage.js` file | GitHub Pages can't run a server or database |
| Saving (later) | **Node + Express + SQLite** (`better-sqlite3`) | When moving to a real host |
| Weather | **Open-Meteo** | Free, no API key (keys would be public on Pages) |

## Why two phases for saving
GitHub Pages only serves static files (HTML, CSS, JS). It can't run Express or SQLite.
So while on Pages, data is saved in the browser with `localStorage`.

To make the later switch easy, **every save/load goes through one file**: `src/storage/storage.js`.
Components never touch `localStorage` directly. Later, only that one file changes to call the Express API instead.

```js
// storage.js: the only file that knows WHERE data is saved.
export function loadSettings() {
  const saved = localStorage.getItem("settings");

  if (saved) {
    return JSON.parse(saved);
  } else {
    return null;
  }
}

export function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}
```

Note: localStorage data lives in one browser only. Add a simple **Export / Import settings** button (JSON file) so nothing is lost.

## What gets saved
Same shape now (localStorage keys) and later (SQLite tables):
- `settings` : background, theme, time-of-day / season modes (Auto / Manual / Off), name, city
- `apps` : each App on the board, its type, position (x, y, w, h) and its own settings
- `playlists` : saved playlists / links

Content that rarely changes (backgrounds list, welcome messages, holidays) lives in **data files** in the code, not in storage.

## Folder shape
```
focus-board/
  src/
    apps/               one folder per App
      Clock/
        Clock.jsx
        Clock.css
        app.config.js   name, icon, default size
    backgrounds/        one folder per background
    effects/            rain, snow
    themes/             theme variable files
    content/            welcome-messages.js, holidays.js
    components/         shared bits (Board, AppFrame, SettingsPanel)
    storage/
      storage.js        the only file that saves/loads
  server/               LATER, not needed on GitHub Pages
```

## GitHub Pages notes
- Set `base: "/<repo-name>/"` in `vite.config.js`.
- Deploy with a GitHub Action on push to `main`.
- No secret API keys in the frontend. Everything on Pages is public.
- YouTube / Spotify embeds work fine on Pages.

## Adding a new App (the goal)
1. Copy an existing App folder.
2. Rename and edit it.
3. Add one line to the apps list.

## Syncing across devices (parked, decided 2026-09-28)
localStorage does not sync between computers, even with browser sync. v1 uses Export / Import only.
Later options, each only changes `storage.js`:
- Save `settings.json` to the repo through the GitHub API (personal token, Save button).
- Free hosted database (e.g. Supabase).
- Move to a real host with Express + SQLite.
