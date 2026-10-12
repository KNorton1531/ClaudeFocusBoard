// Night flight: looking out of a plane window at night, over clouds and city lights.
// A picture plus scene layers. See backgrounds/layers/ for every layer type
// and what it takes. All positions are % of the picture.
import image from './night-flight.png'

// The glass of the window. Stars and clouds stay inside it.
const windowGlass = { left: 25.8, top: 4.8, width: 49, height: 86.2, rounded: 14 }

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
        [11, 6], [21, 20], [31, 11], [43, 27], [53, 5], [61, 16],
        [72, 8], [80, 23], [88, 12], [37, 34], [66, 31], [17, 30],
      ],
    },
    {
      type: 'clouds',
      area: windowGlass,
      color: 'rgba(190, 205, 235, 0.15)',
      clouds: [
        { top: 46, height: 12, seconds: 45 },
        { top: 70, height: 16, seconds: 70 },
      ],
    },
    {
      // The reading light above the window.
      type: 'glow',
      left: 50,
      top: 3,
      width: 22,
      height: 12,
      color: 'rgba(255, 214, 160, 0.35)',
      seconds: 9,
    },
  ],
}
