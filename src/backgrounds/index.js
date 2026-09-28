// backgrounds/index.js: the list of every background you can pick.
// To add one: make its folder, import it here, and add one line to the list.
import AutumnForest from './AutumnForest/AutumnForest.jsx'
import NightCity from './NightCity/NightCity.jsx'
import SnowCabin from './SnowCabin/SnowCabin.jsx'

export const backgroundList = [
  { id: 'autumn-forest', name: 'Autumn forest', component: AutumnForest },
  { id: 'night-city', name: 'Night city', component: NightCity },
  { id: 'snow-cabin', name: 'Cabin in the snow', component: SnowCabin },
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
