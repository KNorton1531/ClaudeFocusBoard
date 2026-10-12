// backgrounds/index.js: the list of every background you can pick.
//
// Picture backgrounds (the normal way): make a folder with the picture and a
// background.config.js listing its layers, import the config here, and add
// one line to the list. See NightFlight/ for an example.
//
// The older CSS-drawn backgrounds have their own component instead.
import AutumnForest from './AutumnForest/AutumnForest.jsx'
import NightCity from './NightCity/NightCity.jsx'
import SnowCabin from './SnowCabin/SnowCabin.jsx'
import SceneBackground from './layers/SceneBackground.jsx'
import { config as nightFlightConfig } from './NightFlight/background.config.js'

export const backgroundList = [
  { id: 'autumn-forest', name: 'Autumn forest', component: AutumnForest },
  { id: 'night-city', name: 'Night city', component: NightCity },
  { id: 'snow-cabin', name: 'Cabin in the snow', component: SnowCabin },
  { ...nightFlightConfig, component: SceneBackground },
]

export function findBackground(id) {
  for (const background of backgroundList) {
    if (background.id === id) {
      return background
    }
  }

  // Unknown id: fall back to the first background.
  return backgroundList[0]
}
