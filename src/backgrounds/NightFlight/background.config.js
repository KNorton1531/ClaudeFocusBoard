// Night flight: looking out of a plane window at night, over the wing and city lights.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from '../assets/nightFlight.png'

// The glass of the window. Stars and clouds stay inside it.
const windowGlass = { left: 29.6, top: 5.8, width: 41, height: 82.4, rounded: 14 }

export const config = {
  id: 'night-flight',
  name: 'Night flight',
  image: image,
  layers: [
    {
      type: 'stars',
      area: windowGlass,
      // These are % of the window, not the whole picture.
      spots: [
        [11, 6], [21, 14], [31, 9], [43, 20], [53, 5], [61, 13],
        [72, 8], [80, 18], [88, 11], [37, 24], [66, 22], [17, 23],
      ],
    },
    {
      type: 'clouds',
      area: windowGlass,
      color: 'rgba(170, 185, 225, 0.14)',
      clouds: [
        { top: 34, height: 10, seconds: 50 },
        { top: 78, height: 14, seconds: 70 },
      ],
    },
    {
      // The warm light around the window frame.
      type: 'glow',
      left: 50,
      top: 47,
      width: 56,
      height: 96,
      color: 'rgba(255, 170, 90, 0.12)',
      seconds: 10,
    },
    {
      // The light on the wingtip.
      type: 'glow',
      left: 64.2,
      top: 45.7,
      width: 2.5,
      height: 4.5,
      color: 'rgba(255, 190, 110, 0.9)',
      seconds: 2.5,
    },
  ],
}
