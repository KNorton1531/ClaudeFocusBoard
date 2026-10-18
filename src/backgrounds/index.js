// backgrounds/index.js: the list of every background you can pick.
//
// To add one: put the 16:9 picture in assets/, make a folder with a
// background.config.js listing its layers (copy NightFlight/), import the
// config here, and add one line to the list.
// Every background is drawn by layers/SceneBackground.jsx.
import { config as halloweenGarden } from './HalloweenGarden/background.config.js'
import { config as cityWindow } from './CityWindow/background.config.js'
import { config as snowyCabin } from './SnowyCabin/background.config.js'
import { config as winterCampfire } from './WinterCampfire/background.config.js'
import { config as nightFlight } from './NightFlight/background.config.js'

export const backgroundList = [halloweenGarden, cityWindow, snowyCabin, winterCampfire, nightFlight]

export function findBackground(id) {
  for (const background of backgroundList) {
    if (background.id === id) {
      return background
    }
  }

  // Unknown id (maybe an old background that was removed): fall back to the first one.
  return backgroundList[0]
}
