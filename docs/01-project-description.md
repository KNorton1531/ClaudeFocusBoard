# Focus Board: Project Description

## One line
A cozy, single-user focus board: one page with a relaxing background where I can add, drag and resize small "Apps".

## Who it's for
Just me (Kyle). No accounts, no sign-up, no sharing.

## Key terms
- **Board**: the whole page / canvas.
- **App**: a self-contained component that lives on the board (e.g. clock, weather, lofi player).
- **Background**: the cozy scene behind everything. A static image, swappable.
- **Scene animation**: movement that belongs to one background (clouds, flickering lights). Not an effect.
- **Effect**: a weather-style overlay that works on any background (rain, snow).
- **Theme**: colors and fonts. Can change with season or time of day.

## Core features (v1)
1. Board with 3 swappable backgrounds (Autumn forest, Night city, Cabin in the snow), using placeholders until the AI art is ready.
2. Add, drag, resize and remove Apps.
3. Layout is saved, so it's the same after a refresh.
4. Welcome message (header + sub-header, top left) based on time of day, season, holidays and special days. See welcome/.
5. A handful of starter Apps (see 04-apps.md).

## Side features (after v1)
- Dynamic weather effects matching real weather.
- Auto theme changes by time of day / season.
- More backgrounds and Apps.

## Settings (highly customisable)
- Every dynamic feature (time of day, season, weather effects, auto theme) has three modes:
  - **Auto**: follows the real clock / date / weather.
  - **Manual**: pick a value yourself (e.g. winter theme in summer, night look at noon).
  - **Off**: feature disabled.
- Manual choices are saved and stay until changed.
- **Exception:** the welcome message always uses the real time, date and holidays. It can't be overridden.

## Principles
- **Cozy first.** Soft colors, gentle motion, no clutter.
- **Component-based.** Every App, background and effect is its own folder.
- **Easy to edit.** Content (messages, backgrounds, playlists) lives in plain data files a non-coder can change.
- **Readable code.** Simple, full `if () {} else {}`, no clever shortcuts.
- **Small scope.** Ship v1 small. Past attempts stalled; finishing beats perfect.

## Out of scope
- Multiple users or logins.
- Mobile-first design (desktop first, mobile just shouldn't break).
