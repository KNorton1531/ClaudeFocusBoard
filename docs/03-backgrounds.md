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

## Folder shape (per background)
```
backgrounds/
  AutumnForest/
    AutumnForest.jsx      puts the layers together
    AutumnForest.css      scene animations
    placeholder.jpg       swap for the AI image later
    background.config.js  name, default theme, thumbnail
```

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
