// City window: two dogs asleep on a big bed by a window, with the city lit up outside.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from '../assets/nightWindow.png'

// The glass of the big window. Stars and clouds stay inside it.
const windowGlass = { left: 27.4, top: 0, width: 57.5, height: 53.7, rounded: 0 }

export const config = {
  id: 'city-window',
  name: 'City window',
  image: image,
  layers: [
    {
      type: 'stars',
      area: windowGlass,
      // These are % of the window, not the whole picture.
      spots: [
        [8, 5], [16, 14], [24, 4], [33, 10], [41, 18], [49, 6],
        [57, 12], [68, 4], [76, 15], [85, 7], [92, 13],
      ],
    },
    {
      type: 'clouds',
      area: windowGlass,
      color: 'rgba(150, 165, 210, 0.12)',
      clouds: [
        { top: 6, height: 12, seconds: 80 },
        { top: 22, height: 10, seconds: 110, fromLeft: true },
      ],
    },
    {
      // The red light on top of the tallest tower.
      type: 'glow',
      left: 66.6,
      top: 15.7,
      width: 1.6,
      height: 2.8,
      color: 'rgba(255, 80, 70, 0.9)',
      seconds: 3,
    },
    {
      // The table lamp.
      type: 'glow',
      left: 13.8,
      top: 28.2,
      width: 22,
      height: 38,
      color: 'rgba(255, 190, 110, 0.3)',
      seconds: 10,
    },
  ],
}
