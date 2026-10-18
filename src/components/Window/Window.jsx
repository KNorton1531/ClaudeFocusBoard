// Window: a big pop-up window in the middle of the screen, over a dimmed backdrop.
// Every menu (Apps, Look, Settings) is drawn inside one.
// Clicking the backdrop, pressing Escape or pressing ✕ closes it.
//
// Tabs are optional. Pass a list like [{ id: 'styling', name: 'Styling', icon: '◐' }]
// with the picked tab's id and onPickTab, and the window shows them down the side.
import { useEffect } from 'react'
import './Window.css'

function Window({ title, onClose, tabs, selectedTab, onPickTab, children }) {
  // Escape closes the window.
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

  // Only a click on the backdrop itself closes it, not a click inside the window.
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  let tabList = null
  let windowClassName = 'window'

  if (tabs) {
    windowClassName = 'window window-with-tabs'

    const tabButtons = tabs.map(function (tab) {
      let className = 'window-tab'
      if (tab.id === selectedTab) {
        className = 'window-tab window-tab-picked'
      }

      return (
        <button
          key={tab.id}
          className={className}
          onClick={function () {
            onPickTab(tab.id)
          }}
        >
          <span className="window-tab-icon">{tab.icon}</span>
          {tab.name}
        </button>
      )
    })

    tabList = <nav className="window-tabs">{tabButtons}</nav>
  }

  return (
    <div className="window-backdrop" onMouseDown={handleBackdropClick}>
      <div className={windowClassName} role="dialog" aria-label={title}>
        <div className="window-head">
          <h2 className="window-title">{title}</h2>
          <button className="window-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
        <div className="window-main">
          {tabList}
          <div className="window-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Window
