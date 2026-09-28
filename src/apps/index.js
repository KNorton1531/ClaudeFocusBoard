// apps/index.js: the list of every App you can add to the board.
// To add a new App: make its folder, import it here, and add one line to the list.
import Clock from './Clock/Clock.jsx'
import Pomodoro from './Pomodoro/Pomodoro.jsx'
import Notes from './Notes/Notes.jsx'

// w and h are in grid squares (24 columns across, each row is 30px tall).
export const appList = [
  { type: 'clock', name: 'Clock', component: Clock, w: 6, h: 5 },
  { type: 'pomodoro', name: 'Pomodoro', component: Pomodoro, w: 6, h: 6 },
  { type: 'notes', name: 'Sticky note', component: Notes, w: 5, h: 6 },
]

export function findApp(type) {
  for (const app of appList) {
    if (app.type === type) {
      return app
    }
  }

  return null
}
