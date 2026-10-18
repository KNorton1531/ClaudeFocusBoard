// Halloween garden: two dogs asleep on a blanket in an autumn garden at night,
// with pumpkins, lanterns and a full moon over the town.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from '../assets/halloweenGarden.png'

// The same warm candle colour for every lantern and pumpkin.
const candle = 'rgba(255, 170, 70, 0.45)'

export const config = {
  id: 'halloween-garden',
  name: 'Halloween garden',
  image: image,
  layers: [
    {
      type: 'stars',
      spots: [
        [26, 4], [29, 12], [35, 3], [38, 17], [40, 8], [44, 4],
        [46, 13], [48, 2], [24, 9], [42, 20],
      ],
    },
    {
      // Moonlight.
      type: 'glow',
      left: 32,
      top: 11.9,
      width: 9,
      height: 16,
      color: 'rgba(255, 245, 210, 0.3)',
      seconds: 12,
    },
    // The pumpkin lights on the string under the pergola.
    { type: 'glow', left: 58.9, top: 9.4, width: 3.5, height: 6, color: candle, seconds: 3, flicker: true },
    { type: 'glow', left: 64.4, top: 14, width: 3.5, height: 6, color: candle, seconds: 3.6, flicker: true },
    { type: 'glow', left: 72.8, top: 17.2, width: 3.5, height: 6, color: candle, seconds: 3.2, flicker: true },
    { type: 'glow', left: 79.2, top: 15.9, width: 3.5, height: 6, color: candle, seconds: 3.9, flicker: true },
    // Jack-o'-lanterns.
    { type: 'glow', left: 54.1, top: 57.9, width: 6, height: 10, color: candle, seconds: 2.8, flicker: true },
    { type: 'glow', left: 94.5, top: 78.1, width: 10, height: 16, color: candle, seconds: 3.4, flicker: true },
    // Lanterns.
    { type: 'glow', left: 89.5, top: 22.8, width: 6, height: 10, color: candle, seconds: 4, flicker: true },
    { type: 'glow', left: 78, top: 39.9, width: 4, height: 7, color: candle, seconds: 3.3, flicker: true },
    { type: 'glow', left: 97, top: 54.7, width: 5, height: 9, color: candle, seconds: 3.7, flicker: true },
    { type: 'glow', left: 15, top: 43.6, width: 3.5, height: 6, color: candle, seconds: 3.1, flicker: true },
    { type: 'glow', left: 29.7, top: 46.8, width: 3.5, height: 6, color: candle, seconds: 3.5, flicker: true },
    { type: 'glow', left: 10.3, top: 55.3, width: 4, height: 7, color: candle, seconds: 2.9, flicker: true },
    { type: 'glow', left: 17.5, top: 81.3, width: 5, height: 9, color: candle, seconds: 3.8, flicker: true },
    {
      // Steam from the mug on the table.
      type: 'smoke',
      left: 94,
      top: 59.5,
      size: 0.5,
      color: 'rgba(255, 255, 255, 0.2)',
      puffs: 4,
      seconds: 5,
    },
  ],
}
