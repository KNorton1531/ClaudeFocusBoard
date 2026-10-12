# Apps

Trimmed list, decided 2026-09-28.

## Audio
| App | What it does | Difficulty | Status |
|---|---|---|---|
| Ambient noise mixer | Sliders for rain, fire, cafe, birds, etc. | Easy/Med | [v1] |
| Lofi player | Not an App: a music bar fixed at the bottom of the screen. Plays 24/7 YouTube lofi streams (see below). | Easy/Med | done |
| YouTube livestream | For watching: scenic landscapes, animal cams, etc. Saved list of streams. | Easy | [v1] |
| Spotify embed | Plays your personal Spotify playlists | Easy | [v1] |

### Lofi player (decided 2026-10-12)
- Lives in `src/components/LofiPlayer/`. Always on the page, centred at the bottom. The board stops above it.
- Streams live in `src/content/lofi-streams.js` (name, channel, YouTube video id). The first one is the default.
- Controls: stream name and thumbnail (click for the list), previous, play/pause, next, volume, list, video background.
- Uses YouTube's IFrame Player API. Nothing autoplays. Play and pause fade the sound in and out.
- **Video background**: the stream's video is always on the page but see-through. The button fades it in behind the Apps, so the stream never reloads. Whenever the video isn't playing (paused, loading), the stream's cover picture sits on top, hiding YouTube's own play button and spinner.
- Saved in `settings`: `lofiStreamId`, `lofiVolume`, `lofiVideoBackground`.
- If a stream ends, the bar says "Can't play this stream". Swap in the new video id.

## Info
| App | What it does | Difficulty | Status |
|---|---|---|---|
| Clock | Time, date and extra city clocks in one app. Settings choose what's shown. | Easy | [v1] |
| Weather | Current weather + short forecast (Open-Meteo) | Medium | [v1] |

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
