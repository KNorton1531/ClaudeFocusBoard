# Themes

A theme is just a set of CSS variables (colors, fonts, blur, radius). Swapping theme = swapping variables.

## Starter themes
| Theme | Feel | Status |
|---|---|---|
| Warm Cafe | Browns, cream, soft orange | [?] |
| Midnight | Deep blue, soft purple, dim | [?] |
| Forest | Greens, wood tones | [?] |
| Sakura | Soft pinks, white | [?] |
| Frost | Pale blue, white, glassy | [?] |

## Time of day
| Period | Hours | Idea |
|---|---|---|
| Early morning | 5 to 8 | Soft pastel light |
| Day | 8 to 17 | Brightest |
| Evening | 17 to 21 | Warm golden |
| Night | 21 to 1 | Dim, cool |
| Late night | 1 to 5 | Very dim, "you're up late" |

## Seasons
| Season | Default theme | Default effect |
|---|---|---|
| Spring | Sakura | Petals |
| Summer | Warm Cafe | None / fireflies at night |
| Autumn | Forest | Falling leaves |
| Winter | Frost | Snow |

## Overrides (decided)
Time of day, season and theme each have a setting: **Auto**, **Manual** (pick any value, e.g. winter in summer) or **Off**. The welcome message ignores these and always uses the real date and time.

## Fonts
Picked separately from the theme, in the scene editor's Font tab (Look button). Each choice swaps `--font-body` and `--font-heading`.

| Font | Body / heading |
|---|---|
| Soft & Round (default) | Nunito / Quicksand |
| Storybook | Lora / Fraunces |
| Handwritten | Patrick Hand / Caveat |
| Typewriter | Courier Prime |
| Clean | DM Sans |

To add one: a `[data-font]` block in `src/themes/fonts.css`, the font in the Google Fonts link at the top of `src/index.css`, and one line in `src/themes/fonts.js`.
