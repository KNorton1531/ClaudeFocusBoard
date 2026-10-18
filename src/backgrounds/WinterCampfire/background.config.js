// Winter campfire: two dogs asleep in a tent beside a campfire, in a snowy forest by a lake.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from '../assets/snowyCampfire.png'

export const config = {
  id: 'winter-campfire',
  name: 'Winter campfire',
  image: image,
  layers: [
    {
      type: 'stars',
      spots: [
        [27, 18], [33, 5], [37, 22], [41, 8], [45, 15], [49, 3],
        [52, 20], [55, 9], [36, 13], [44, 24],
      ],
    },
    {
      // Moonlight.
      type: 'glow',
      left: 30.2,
      top: 13.1,
      width: 9,
      height: 16,
      color: 'rgba(255, 240, 200, 0.3)',
      seconds: 12,
    },
    {
      // The campfire's light on the snow.
      type: 'glow',
      left: 51.1,
      top: 66,
      width: 34,
      height: 34,
      color: 'rgba(255, 150, 60, 0.35)',
      seconds: 2,
      flicker: true,
    },
    {
      type: 'smoke',
      left: 51.1,
      top: 55.3,
      size: 1.2,
      color: 'rgba(200, 200, 215, 0.18)',
      puffs: 6,
      seconds: 7,
    },
    {
      // The lamp inside the tent.
      type: 'glow',
      left: 75.4,
      top: 59.5,
      width: 18,
      height: 22,
      color: 'rgba(255, 190, 100, 0.25)',
      seconds: 8,
    },
  ],
}
