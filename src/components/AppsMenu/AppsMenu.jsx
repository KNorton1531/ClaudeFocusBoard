// AppsMenu: the "Apps" menu.
// Lists every App, each with a switch to show or hide it.
// Switching on an App that isn't on the board yet adds it.
import MenuPanel from '../MenuPanel/MenuPanel.jsx'
import { appList } from '../../apps/index.js'
import './AppsMenu.css'

function AppsMenu({ apps, onClose, onAddApp, onToggleApp }) {
  const rows = []

  // Go through the Apps in the same order as apps/index.js.
  for (const appInfo of appList) {
    const onBoard = apps.filter(function (app) {
      return app.type === appInfo.type
    })

    if (onBoard.length === 0) {
      // Not on the board yet, so the switch is off and turning it on adds it.
      rows.push(
        <div key={appInfo.type} className="apps-menu-row">
          <span className="apps-menu-name">{appInfo.name}</span>
          <input
            type="checkbox"
            className="apps-menu-switch"
            title="Show"
            checked={false}
            onChange={function () {
              onAddApp(appInfo.type)
            }}
          />
        </div>,
      )
    } else {
      // On the board. There might be more than one (like two sticky notes),
      // so number them when there are.
      onBoard.forEach(function (app, index) {
        let name = appInfo.name
        if (onBoard.length > 1) {
          name = appInfo.name + ' ' + (index + 1)
        }

        let isShown = true
        let switchTitle = 'Hide'
        if (app.hidden) {
          isShown = false
          switchTitle = 'Show'
        }

        rows.push(
          <div key={app.id} className="apps-menu-row">
            <span className="apps-menu-name">{name}</span>
            <input
              type="checkbox"
              className="apps-menu-switch"
              title={switchTitle}
              checked={isShown}
              onChange={function () {
                onToggleApp(app.id)
              }}
            />
          </div>,
        )
      })
    }
  }

  return (
    <MenuPanel title="Apps" onClose={onClose}>
      <div className="apps-menu-list">{rows}</div>
      <p className="menu-hint">Switching an app off hides it. Its place and settings are kept for next time.</p>
    </MenuPanel>
  )
}

export default AppsMenu
