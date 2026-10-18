// Snowy cabin: a lit log cabin in a snowy forest at night, under a full moon.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from '../assets/snowyCabin.png'

export const config = {
  id: 'snowy-cabin',
  name: 'Snowy cabin',
  image: image,
  layers: [
    {
      type: 'stars',
      spots: [
        [30, 3], [37, 9], [43, 4], [50, 12], [55, 6], [62, 3],
        [68, 9], [86, 4], [26, 14], [47, 18], [58, 15], [72, 2],
      ],
    },
    {
      // Moonlight.
      type: 'glow',
      left: 78.5,
      top: 10.4,
      width: 9,
      height: 16,
      color: 'rgba(255, 240, 200, 0.3)',
      seconds: 12,
    },
    {
      type: 'smoke',
      left: 47.7,
      top: 39.9,
      size: 1,
      color: 'rgba(215, 222, 240, 0.25)',
      puffs: 6,
      seconds: 8,
    },
    {
      // The cabin windows.
      type: 'glow',
      left: 51.5,
      top: 48,
      width: 18,
      height: 16,
      color: 'rgba(255, 180, 90, 0.35)',
      seconds: 6,
      flicker: true,
    },
    {
      // The windows reflected in the river.
      type: 'glow',
      left: 79.2,
      top: 69.1,
      width: 12,
      height: 7,
      color: 'rgba(255, 180, 90, 0.2)',
      seconds: 9,
    },
  ],
}
