// AppsMenu: the "Apps" menu.
// Shows every App on the board with a switch to show or hide it,
// and a list underneath for adding more.
import MenuPanel from '../MenuPanel/MenuPanel.jsx'
import { appList, findApp } from '../../apps/index.js'
import './AppsMenu.css'

function AppsMenu({ apps, onClose, onAddApp, onToggleApp, onRemoveApp }) {
  // Only Apps that still exist in apps/index.js can be listed.
  const knownApps = apps.filter(function (app) {
    if (findApp(app.type)) {
      return true
    } else {
      return false
    }
  })

  const rows = knownApps.map(function (app) {
    const appInfo = findApp(app.type)

    let isShown = true
    if (app.hidden) {
      isShown = false
    }

    return (
      <div key={app.id} className="apps-menu-row">
        <label className="apps-menu-toggle">
          <input
            type="checkbox"
            checked={isShown}
            onChange={function () {
              onToggleApp(app.id)
            }}
          />
          <span className="apps-menu-name">{appInfo.name}</span>
        </label>
        <button
          className="apps-menu-remove"
          title="Remove this app for good"
          onClick={function () {
            onRemoveApp(app.id)
          }}
        >
          ✕
        </button>
      </div>
    )
  })

  const addButtons = appList.map(function (appInfo) {
    return (
      <button
        key={appInfo.type}
        className="apps-menu-add"
        onClick={function () {
          onAddApp(appInfo.type)
        }}
      >
        + {appInfo.name}
      </button>
    )
  })

  let onBoard = null
  if (knownApps.length > 0) {
    onBoard = <div className="apps-menu-list">{rows}</div>
  } else {
    onBoard = <p className="menu-hint">No apps yet. Add one below.</p>
  }

  return (
    <MenuPanel title="Apps" onClose={onClose}>
      <div className="menu-section">
        <h3 className="menu-section-title">On the board</h3>
        {onBoard}
      </div>

      <div className="menu-section">
        <h3 className="menu-section-title">Add an app</h3>
        <div className="apps-menu-add-list">{addButtons}</div>
        <p className="menu-hint">
          Unticking an app hides it and keeps its place. The ✕ removes it for good.
        </p>
      </div>
    </MenuPanel>
  )
}

export default AppsMenu
