// apps/index.js: the list of every App you can add to the board.
// To add a new App: make its folder with an App.jsx and an app.config.js,
// import both here, and add one line to the list.
import Clock from './Clock/Clock.jsx'
import { config as clockConfig } from './Clock/app.config.js'
import Weather from './Weather/Weather.jsx'
import { config as weatherConfig } from './Weather/app.config.js'
import Livestream from './Livestream/Livestream.jsx'
import { config as livestreamConfig } from './Livestream/app.config.js'
import Flight from './Flight/Flight.jsx'
import { config as flightConfig } from './Flight/app.config.js'

// Each entry is that App's config plus the component that draws it.
// Sizes (w and h) are in grid squares. See docs/02-tech-stack.md.
export const appList = [
  { ...clockConfig, component: Clock },
  { ...weatherConfig, component: Weather },
  { ...livestreamConfig, component: Livestream },
  { ...flightConfig, component: Flight },
]

export function findApp(type) {
  for (const app of appList) {
    if (app.type === type) {
      return app
    }
  }

  return null
}

// Fills in any setting the saved App is missing, so older saves keep working
// after a new setting is added to an app.config.js.
export function withDefaultSettings(type, saved) {
  const appInfo = findApp(type)

  if (!appInfo) {
    return {}
  }

  if (saved) {
    return { ...appInfo.defaultSettings, ...saved }
  } else {
    return { ...appInfo.defaultSettings }
  }
}
