// apps/index.js: the list of every App you can add to the board.
// To add a new App: make its folder with an App.jsx and an app.config.js,
// import both here, and add one line to the list.
import Clock from './Clock/Clock.jsx'
import { config as clockConfig } from './Clock/app.config.js'
import Pomodoro from './Pomodoro/Pomodoro.jsx'
import { config as pomodoroConfig } from './Pomodoro/app.config.js'
import Notes from './Notes/Notes.jsx'
import { config as notesConfig } from './Notes/app.config.js'

// Each entry is that App's config plus the component that draws it.
// Sizes (w and h) are in grid squares. See docs/02-tech-stack.md.
export const appList = [
  { ...clockConfig, component: Clock },
  { ...pomodoroConfig, component: Pomodoro },
  { ...notesConfig, component: Notes },
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
