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

Art will be AI-generated later. Use placeholder images while building.

## v1 backgrounds
| Name | Mood | Scene animation ideas | Status |
|---|---|---|---|
| Autumn forest | Warm, golden, calm | Drifting clouds, swaying branches, light rays, a few falling leaves | [v1] |
| Night city from a bedroom | Quiet, late night | Window lights flicker on/off, blinking signs, passing car lights, moving clouds | [v1] |
| Cabin in the snow | Cozy, winter | Chimney smoke, glowing/flickering cabin window, slow clouds | [v1] |
| Night flight | Calm, late night, travelling | Twinkling stars, wisps drifting past the window, glowing reading light. First one with real art (`night-flight.png`) | done |

## Folder shape (per background, decided 2026-10-12)
A background is a 16:9 picture plus a list of scene layers. No code per background.
```
backgrounds/
  NightFlight/
    night-flight.png      the picture (16:9, e.g. 1920 x 1080)
    background.config.js  id, name, picture, and its layers
  layers/                 shared: SceneBackground draws any config
    Stars, Clouds, Glow, Smoke
```
- Positions are % of the picture, so layers stay lined up on any screen shape.
- A layer can have an `area` (e.g. a window). It's then drawn only inside it, and its positions are % of that area.
- Layer types: `stars` (twinkle), `clouds` (drift sideways), `glow` (lamps, lit windows; `flicker: true` for fire), `smoke` (chimneys, tea). Each layer's file says what it takes.
- New layer type: make its component in `layers/`, add one line to `SceneLayer.jsx`.
- Autumn forest, Night city and Cabin in the snow are still the old CSS-drawn placeholders. Move them over when their art is ready.

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
