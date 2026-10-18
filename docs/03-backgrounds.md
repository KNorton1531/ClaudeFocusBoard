# Backgrounds

## How a background is built
Each background is a **static image** with **scene animations** layered on top. No video loops (too heavy).

```
Layer 4: Effects          weather overlays (rain, snow). Separate system, see below.
Layer 3: Scene animations  belong to this background (drifting clouds, flickering lights)
Layer 2: Static image      the AI-generated scene
Layer 1: Base color        fallback while the image loads
```

- **Scene animations** are part of a background. They only make sense for that scene (e.g. window lights in the city).
- **Effects** are separate and work on any background (weather). Controlled by settings.

## Backgrounds (all AI art, 2026-10-18)
| Name | Picture | Scene layers |
|---|---|---|
| Halloween garden (default) | `halloweenGarden.png` | Stars, moonlight, flickering pumpkins and lanterns, steam from the mug |
| City window | `nightWindow.png` | Stars and clouds in the window, red light on the tallest tower, lamp glow |
| Snowy cabin | `snowyCabin.png` | Stars, moonlight, chimney smoke, cabin windows, river reflection |
| Winter campfire | `snowyCampfire.png` | Stars, moonlight, flickering fire, fire smoke, tent lamp |
| Night flight | `nightFlight.png` | Stars and clouds in the window, frame glow, wingtip light |

The old CSS-drawn placeholders (Autumn forest, Night city, Cabin in the snow) were removed. A saved id that no longer exists falls back to the first background.

## Folder shape (per background, decided 2026-10-12, pictures moved to assets/ 2026-10-18)
A background is a 16:9 picture plus a list of scene layers. No code per background.
```
backgrounds/
  assets/                 every picture (16:9, e.g. 1672 x 941 or 1920 x 1080)
  NightFlight/
    background.config.js  id, name, picture (from assets/), and its layers
  layers/                 shared: SceneBackground draws any config
    Stars, Clouds, Glow, Smoke
```
- Positions are % of the picture, so layers stay lined up on any screen shape.
- A layer can have an `area` (e.g. a window). It's then drawn only inside it, and its positions are % of that area.
- Layer types: `stars` (twinkle), `clouds` (drift sideways), `glow` (lamps, lit windows; `flicker: true` for fire), `smoke` (chimneys, tea). Each layer's file says what it takes.
- New layer type: make its component in `layers/`, add one line to `SceneLayer.jsx`.

## Fit to screen (added 2026-10-18)
For screens that aren't 16:9 (e.g. a vertical 1080p monitor). In Look → Background settings, under "Fit to screen":
- **Fill the screen** (default): covers the screen and crops the edges.
- **Show it all**: the whole picture, with a blurred copy behind it filling the gaps.
- **Left ↔ Right / Top ↔ Bottom** sliders: slide the picture to pick which part shows.

Each picture background remembers its own framing. The video background (lofi bar ▣) has one of its own; when it's on, the controls change the video. Saved in `settings.framing`, keyed by background id or `'video'`. Logic in `src/backgrounds/framing.js` + `framing.css`, words in `src/content/background-framing.js`.

## Effects (overlays, any background)
| Effect | Status |
|---|---|
| Rain (with drops on glass) | [?] |
| Snow | [?] |
| Falling leaves | [?] |
| Fireflies | [?] |
| Fog / mist | [?] |
| Lightning flashes | [?] |

## Parked ideas (later)
Rainy window cafe, Campfire under stars, Library / bookshop, Pixel art room, Ocean sunset, Japanese garden, Space / nebula.

## Open questions
- Which effects go in v1? Suggest: Rain and Snow.
