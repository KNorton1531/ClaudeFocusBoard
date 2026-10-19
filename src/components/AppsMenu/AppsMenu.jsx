// AppsMenu: the row of App buttons that opens above the music bar.
// Each App is one button. Lit up means it's on the board, press it to hide it.
// Pressing an App that isn't on the board yet adds it.
// Hiding keeps the App's place and settings for next time.
// Clicking away or pressing Escape closes the row. The menu bar's own
// buttons don't count as clicking away, so the Apps button still toggles it.
import { useEffect } from 'react'
import { appList } from '../../apps/index.js'
import { appsText } from '../../content/menu-bar.js'
import { useClickAway } from '../useClickAway.js'
import './AppsMenu.css'

function AppsMenu({ apps, onClose, onAddApp, onToggleApp }) {
  const rowRef = useClickAway(onClose, '.menu-bar')

  // Escape closes it, like the other menus.
  useEffect(
    function () {
      function handleKeyDown(event) {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return function () {
        document.removeEventListener('keydown', handleKeyDown)
      }
    },
    [onClose],
  )

  const buttons = []

  // Go through the Apps in the same order as apps/index.js.
  for (const appInfo of appList) {
    const onBoard = apps.filter(function (app) {
      return app.type === appInfo.type
    })

    if (onBoard.length === 0) {
      // Not on the board yet, so pressing it adds it.
      buttons.push(
        <button
          key={appInfo.type}
          className="apps-menu-button"
          title={appsText.add}
          onClick={function () {
            onAddApp(appInfo.type)
          }}
        >
          <span className="apps-menu-icon">{appInfo.icon}</span>
          {appInfo.name}
        </button>,
      )
    } else {
      // On the board. There might be more than one (added more than once),
      // so number them when there are.
      onBoard.forEach(function (app, index) {
        let name = appInfo.name
        if (onBoard.length > 1) {
          name = appInfo.name + ' ' + (index + 1)
        }

        let className = 'apps-menu-button apps-menu-button-on'
        let title = appsText.hide
        if (app.hidden) {
          className = 'apps-menu-button'
          title = appsText.show
        }

        buttons.push(
          <button
            key={app.id}
            className={className}
            title={title}
            onClick={function () {
              onToggleApp(app.id)
            }}
          >
            <span className="apps-menu-icon">{appInfo.icon}</span>
            {name}
          </button>,
        )
      })
    }
  }

  return (
    <div className="apps-menu" ref={rowRef} role="dialog" aria-label={appsText.title}>
      {buttons}
    </div>
  )
}

export default AppsMenu
