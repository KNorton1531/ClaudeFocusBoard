# Apps

Trimmed list, decided 2026-09-28.

## Audio
| App | What it does | Difficulty | Status |
|---|---|---|---|
| Ambient noise mixer | Sliders for rain, fire, cafe, birds, etc. | Easy/Med | [v1] |
| Lofi player | Not an App: a music bar fixed at the bottom of the screen. Plays 24/7 YouTube lofi streams (see below). | Easy/Med | done |
| Livestream | For watching: scenic landscapes, animal cams, etc. YouTube only. Saved list of streams. | Easy/Med | done |
| Spotify embed | Plays your personal Spotify playlists | Easy | [v1] |

### Lofi player (decided 2026-10-12)
- Lives in `src/components/LofiPlayer/`. Always on the page, centred at the bottom. It floats on top of the board, so Apps can go right to the bottom on either side of it.
- Streams live in `src/content/lofi-streams.js` (name, channel, YouTube video id). The first one is the default.
- Controls: stream name and thumbnail (click for the list), previous, play/pause, next, volume, list, video background.
- Uses YouTube's IFrame Player API. Nothing autoplays. Play and pause fade the sound in and out.
- **Video background**: the stream's video is always on the page but see-through. The button fades it in behind the Apps, so the stream never reloads. Whenever the video isn't playing (paused, loading), the stream's cover picture sits on top, hiding YouTube's own play button and spinner.
- Saved in `settings`: `lofiStreamId`, `lofiVolume`, `lofiVideoBackground`.
- If a stream ends, the bar says "Can't play this stream". Swap in the new video id.

### Livestream (decided 2026-10-12)
- Lives in `src/apps/Livestream/`. Words are in `src/content/livestream.js`.
- Starts empty. ☰ opens the Streams panel: paste a link (and an optional name) to add, click one to watch it, ✕ to remove. The panel covers the App, so the stream keeps playing underneath.
- YouTube only (Twitch was tried and dropped, 2026-10-12).
- If no name is typed, the video's title is looked up with YouTube's oEmbed address (`streamTitle.js`, no API key) and saved as its name. If the lookup fails, the name is "YouTube stream". The name is saved once, so a later title change doesn't rename it.
- Links it understands (`streamLink.js`): `watch?v=`, `youtu.be/`, `/live/`, `/embed/`, `/shorts/`.
- No channel following: when a channel goes live with a new link, you paste that link in. (Following channels with a YouTube API key was built and dropped as too fiddly, 2026-10-12. YouTube's own pages can't be read from the browser, so the API was the only way without a server.)
- `youtubePlayer.js` wraps YouTube's player in simple controls (`play`, `pause`, `setVolume`, `setMuted`, `destroy`). It shares `loadYouTubeApi.js` with the lofi bar.
- Media bar (`StreamControls.jsx`): name and status, previous / play-pause / next (arrows only with 2+ streams), mute, volume, full screen, ☰. Switching stream while playing starts the next one playing.
- Saved under `livestream-<appId>` as `{ streams, shownId, volume, isMuted }`. Each stream is `{ id, videoId, name }`. Removing the App clears that key.
- Setting: media controls Always (bar under the video) or On hover (floats over the bottom of the video).
- Has a title bar (not compact), because the video swallows mouse clicks, so you couldn't drag it from the video.

## Info
| App | What it does | Difficulty | Status |
|---|---|---|---|
| Clock | Time, date and extra city clocks in one app. Settings choose what's shown. | Easy | [v1] |
| Weather | Current weather + short forecast (Open-Meteo) | Medium | done |

### Weather (decided 2026-10-12)
- Lives in `src/apps/Weather/`. Words and icons are in `src/content/weather.js`.
- Uses Open-Meteo for both the forecast and the place search. Free, no API key, so there are no secrets to hide.
- Shows one place at a time. Arrows and dots at the bottom move between places. + (top left) opens the Places panel to search, add and remove.
- "My location" comes from the browser (it asks permission the first time). It can be turned off in settings.
- Saved places are kept under `weather-<appId>` as `{ places, shownId }`. Removing the App clears that key.
- Layout: Tall (stacked, `WeatherNow.jsx`) or Wide (like Google's card, `WeatherWide.jsx`: icon and temperature, rain/humidity/wind, then the days in a row).
- Settings: layout, include my location, °C / °F, days ahead (none, 3, 5, 7), move to the next place on its own (off, 30 sec, 1 min, 5 min).
- Refreshes every 15 minutes.
- `compact: true`: no title bar, drag from anywhere, frame buttons show in the top right on hover. The + sits top left so they never cover it.
- Fills the card as you resize it. The text size comes from the card's size (CSS container units), and the days spread out to use the space. `contentSize()` in `Weather.jsx` says roughly how big the content is in em; raise those numbers if anything gets cut off.

## Board-wide
- Every grid App resizes from any side or corner (`RESIZE_HANDLES` in `src/components/Board/grid.js`). Only the bottom-right corner shows its arrow.
- Any App can drop its title bar by adding `compact: true` to its `app.config.js`.

### Clock settings
- Floats freely on the board (`floating: true` in `app.config.js`). It is the size of its text, has no resize handle, and drags from anywhere
- Hover to blur it and show the settings, hide and remove buttons. Settings open in a pop-up panel
- Minimal: on / off. Shows only the time, with no card even on hover
- Size: small, medium, large, huge
- Show time: on / off, 12h or 24h, seconds on / off
- Show date: on / off, format (e.g. "Mon 28 Sep" or "28/09/2026")
- Extra clocks: add / remove cities, each with a label

## Focus
| App | What it does | Difficulty | Status |
|---|---|---|---|
| Pomodoro timer | 25/5 focus timer with soft chime | Easy | [v1] |
| Sticky notes | Free text notes | Easy/Med | [v1] |

## Removed
Personal playlists (use Spotify instead), Calendar, World clocks (merged into Clock), To-do list, Daily goal, Habit tracker, Quote of the day, Desk pet, Breathing guide, Photo frame.

## Every App has
- A name and icon
- A default size
- Its own settings (optional)
- A frame with drag handle, close button and settings button (shared component)
