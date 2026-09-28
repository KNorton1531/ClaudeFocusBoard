// App: the whole focus board.
// Holds the settings and the list of Apps, and saves them when they change.
import { useState } from 'react'
import Welcome from './components/Welcome/Welcome.jsx'
import Board from './components/Board/Board.jsx'
import SettingsBar from './components/SettingsBar/SettingsBar.jsx'
import { findApp } from './apps/index.js'
import { findBackground } from './backgrounds/index.js'
import { loadData, saveData } from './storage/storage.js'

const DEFAULT_SETTINGS = {
  name: 'Kyle',
  backgroundId: 'autumn-forest',
}

// What the board looks like the very first time.
const DEFAULT_APPS = [
  { id: 'clock-1', type: 'clock', x: 0, y: 0, w: 6, h: 5 },
  { id: 'pomodoro-1', type: 'pomodoro', x: 7, y: 0, w: 6, h: 6 },
]

function App() {
  const [settings, setSettings] = useState(function () {
    const saved = loadData('settings')

    if (saved) {
      return saved
    } else {
      return DEFAULT_SETTINGS
    }
  })

  const [apps, setApps] = useState(function () {
    const saved = loadData('apps')

    if (saved) {
      return saved
    } else {
      return DEFAULT_APPS
    }
  })

  function updateSettings(newSettings) {
    setSettings(newSettings)
    saveData('settings', newSettings)
  }

  function updateApps(newApps) {
    setApps(newApps)
    saveData('apps', newApps)
  }

  function handleAddApp(type) {
    const appInfo = findApp(type)

    // Put the new App underneath everything else, so it doesn't land on top of another App.
    let lowestPoint = 0
    for (const app of apps) {
      if (app.y + app.h > lowestPoint) {
        lowestPoint = app.y + app.h
      }
    }

    const newApp = {
      id: type + '-' + Date.now(),
      type: type,
      x: 0,
      y: lowestPoint,
      w: appInfo.w,
      h: appInfo.h,
    }

    updateApps([...apps, newApp])
  }

  function handleRemoveApp(id) {
    const remaining = apps.filter(function (app) {
      return app.id !== id
    })

    updateApps(remaining)
  }

  // Called by the grid after a drag or resize. Copy the new positions onto our Apps.
  function handleLayoutChange(layout) {
    const moved = apps.map(function (app) {
      for (const item of layout) {
        if (item.i === app.id) {
          return { ...app, x: item.x, y: item.y, w: item.w, h: item.h }
        }
      }

      return app
    })

    updateApps(moved)
  }

  const BackgroundComponent = findBackground(settings.backgroundId).component

  return (
    <>
      <BackgroundComponent />
      <Welcome name={settings.name} />
      <SettingsBar settings={settings} onSettingsChange={updateSettings} onAddApp={handleAddApp} />
      <Board apps={apps} onLayoutChange={handleLayoutChange} onRemoveApp={handleRemoveApp} />
    </>
  )
}

export default App
