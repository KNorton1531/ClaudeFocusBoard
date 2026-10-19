// App: the whole focus board.
// Holds the settings and the list of Apps, and saves them when they change.
import { useState, useEffect } from 'react'
import Welcome from './components/Welcome/Welcome.jsx'
import Board from './components/Board/Board.jsx'
import MenuBar from './components/MenuBar/MenuBar.jsx'
import AppsMenu from './components/AppsMenu/AppsMenu.jsx'
import LookWindow from './components/LookWindow/LookWindow.jsx'
import SettingsMenu from './components/SettingsMenu/SettingsMenu.jsx'
import AppSettingsMenu from './components/AppSettingsMenu/AppSettingsMenu.jsx'
import LofiPlayer from './components/LofiPlayer/LofiPlayer.jsx'
import SceneEditor from './components/SceneEditor/SceneEditor.jsx'
import { findApp, withDefaultSettings } from './apps/index.js'
import { findFreeSpot } from './components/Board/grid.js'
import SceneBackground from './backgrounds/layers/SceneBackground.jsx'
import { findBackground } from './backgrounds/index.js'
import { findFraming } from './backgrounds/framing.js'
import { findEffect } from './effects/index.js'
import { findTheme } from './themes/index.js'
import { loadData, saveData, removeData } from './storage/storage.js'

const DEFAULT_SETTINGS = {
  name: 'Kyle',
  backgroundId: 'halloween-garden',
  themeId: 'warm-cafe',
  effectId: 'none',
  lofiStreamId: 'chillhop',
  lofiVolume: 50,
  lofiVideoBackground: false,
  // How each background sits on the screen, by background id (see backgrounds/framing.js).
  framing: {},
}

// What the board looks like the very first time.
// The Apps start a little way down, so they don't cover the welcome message.
// The clock floats, so it has "left" and "top" instead of a grid spot (see FloatingApp.jsx).
function makeDefaultApps() {
  return [
    { id: 'clock-1', type: 'clock', left: 0.5, top: 0.15, hidden: false, settings: withDefaultSettings('clock') },
  ]
}

// Saved Apps may come from an older version, so fill in anything missing.
function tidyApps(saved) {
  // Drop any App that's since been taken out of apps/index.js (like the old Pomodoro and Sticky note).
  const known = saved.filter(function (app) {
    if (findApp(app.type)) {
      return true
    }

    // Sticky notes saved their text under their own key, so clear that too.
    removeData('note-' + app.id)
    return false
  })

  return known.map(function (app) {
    let hidden = false
    if (app.hidden) {
      hidden = true
    }

    const tidied = { ...app, hidden: hidden, settings: withDefaultSettings(app.type, app.settings) }

    // A floating App saved before it floated has no "left" and "top" yet.
    const appInfo = findApp(app.type)
    if (appInfo) {
      if (appInfo.floating) {
        if (tidied.left === undefined) {
          tidied.left = appInfo.left
          tidied.top = appInfo.top
        }
      }
    }

    return tidied
  })
}

function App() {
  const [settings, setSettings] = useState(function () {
    const saved = loadData('settings')

    if (saved) {
      return { ...DEFAULT_SETTINGS, ...saved }
    } else {
      return DEFAULT_SETTINGS
    }
  })

  const [apps, setApps] = useState(function () {
    const saved = loadData('apps')

    if (saved) {
      return tidyApps(saved)
    } else {
      return makeDefaultApps()
    }
  })

  // Which menu is open, or an empty string when none is.
  const [openMenu, setOpenMenu] = useState('')

  // When openMenu is 'app-settings', this is the id of the App being edited.
  const [settingsAppId, setSettingsAppId] = useState('')

  // The theme is a set of CSS variables picked by an attribute on <html>.
  useEffect(
    function () {
      document.documentElement.dataset.theme = findTheme(settings.themeId).id
    },
    [settings.themeId],
  )

  function updateSettings(newSettings) {
    setSettings(newSettings)
    saveData('settings', newSettings)
  }

  function updateApps(newApps) {
    setApps(newApps)
    saveData('apps', newApps)
  }

  function handleOpenMenu(id) {
    // Pressing the button of the open menu closes it again.
    if (openMenu === id) {
      setOpenMenu('')
    } else {
      setOpenMenu(id)
    }
  }

  function handleCloseMenu() {
    setOpenMenu('')
  }

  // Opens the pop-up settings for one App (used by floating Apps).
  function handleOpenAppSettings(id) {
    setSettingsAppId(id)
    setOpenMenu('app-settings')
  }

  function handleAddApp(type) {
    const appInfo = findApp(type)

    // A floating App starts where its app.config.js says.
    if (appInfo.floating) {
      const newFloatingApp = {
        id: type + '-' + Date.now(),
        type: type,
        left: appInfo.left,
        top: appInfo.top,
        hidden: false,
        settings: withDefaultSettings(type),
      }

      updateApps([...apps, newFloatingApp])
      return
    }

    // Look for an empty space, so a new App never lands on top of another one.
    // Hidden Apps still hold their place, so they count as taken.
    // Floating Apps aren't in the grid, so they don't count.
    const gridApps = apps.filter(function (app) {
      const info = findApp(app.type)

      if (info) {
        if (info.floating) {
          return false
        }
      }

      return true
    })

    const spot = findFreeSpot(gridApps, appInfo.w, appInfo.h)

    const newApp = {
      id: type + '-' + Date.now(),
      type: type,
      x: spot.x,
      y: spot.y,
      w: spot.w,
      h: spot.h,
      hidden: false,
      settings: withDefaultSettings(type),
    }

    updateApps([...apps, newApp])
  }

  // Hiding keeps the App and its place. Removing throws it away.
  function handleToggleApp(id) {
    const changed = apps.map(function (app) {
      if (app.id === id) {
        if (app.hidden) {
          return { ...app, hidden: false }
        } else {
          return { ...app, hidden: true }
        }
      }

      return app
    })

    updateApps(changed)
  }

  function handleHideApp(id) {
    const changed = apps.map(function (app) {
      if (app.id === id) {
        return { ...app, hidden: true }
      }

      return app
    })

    updateApps(changed)
  }

  function handleRemoveApp(id) {
    const remaining = apps.filter(function (app) {
      return app.id !== id
    })

    // Weather and Livestream save under their own keys, so clear those too.
    removeData('weather-' + id)
    removeData('livestream-' + id)
    updateApps(remaining)
  }

  function handleAppSettingsChange(id, newSettings) {
    const changed = apps.map(function (app) {
      if (app.id === id) {
        return { ...app, settings: newSettings }
      }

      return app
    })

    updateApps(changed)
  }

  // Closes the Look window and opens the scene editor in its place.
  function handleAdjustScene() {
    setOpenMenu('scene')
  }

  function handleResetBoard() {
    updateApps(makeDefaultApps())
  }

  // Called when a floating App is dropped somewhere new.
  function handleMoveApp(id, left, top) {
    const moved = apps.map(function (app) {
      if (app.id === id) {
        return { ...app, left: left, top: top }
      }

      return app
    })

    updateApps(moved)
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

  const background = findBackground(settings.backgroundId)
  const EffectComponent = findEffect(settings.effectId).component

  let effect = null
  if (EffectComponent) {
    effect = <EffectComponent />
  }

  let menu = null
  if (openMenu === 'apps') {
    menu = (
      <AppsMenu
        apps={apps}
        onClose={handleCloseMenu}
        onAddApp={handleAddApp}
        onToggleApp={handleToggleApp}
      />
    )
  } else if (openMenu === 'look') {
    menu = (
      <LookWindow
        settings={settings}
        onClose={handleCloseMenu}
        onSettingsChange={updateSettings}
        onAdjustScene={handleAdjustScene}
      />
    )
  } else if (openMenu === 'scene') {
    menu = (
      <SceneEditor
        settings={settings}
        onSettingsChange={updateSettings}
        onClose={handleCloseMenu}
      />
    )
  } else if (openMenu === 'settings') {
    menu = (
      <SettingsMenu
        settings={settings}
        onClose={handleCloseMenu}
        onSettingsChange={updateSettings}
        onResetBoard={handleResetBoard}
      />
    )
  } else if (openMenu === 'app-settings') {
    // The App might have been removed while its settings were open.
    for (const app of apps) {
      if (app.id === settingsAppId) {
        menu = (
          <AppSettingsMenu
            app={app}
            onClose={handleCloseMenu}
            onSettingsChange={function (newSettings) {
              handleAppSettingsChange(app.id, newSettings)
            }}
          />
        )
      }
    }
  }

  return (
    <>
      <SceneBackground background={background} framing={findFraming(settings.framing, background.id)} />
      {effect}
      <Welcome name={settings.name} />
      <MenuBar openMenu={openMenu} onOpenMenu={handleOpenMenu} />
      {menu}
      <LofiPlayer settings={settings} onSettingsChange={updateSettings} />
      <Board
        apps={apps}
        onLayoutChange={handleLayoutChange}
        onMoveApp={handleMoveApp}
        onOpenAppSettings={handleOpenAppSettings}
        onHideApp={handleHideApp}
        onRemoveApp={handleRemoveApp}
        onAppSettingsChange={handleAppSettingsChange}
      />
    </>
  )
}

export default App
