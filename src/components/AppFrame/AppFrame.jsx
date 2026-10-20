// AppFrame: the frosted card every grid App sits inside.
// The title bar is the drag handle. The buttons open settings or hide the App.
// Hiding keeps its place and settings, and the Apps menu brings it back.
// Pressing the gear flips the card over to show its settings.
//
// A "compact" App (compact: true in its app.config.js) has no title bar, so
// its content can use the whole card. You drag it from anywhere, and the
// buttons appear in the top right corner when you hover.
import { useState } from 'react'
import SettingsFields from '../SettingsFields/SettingsFields.jsx'
import './AppFrame.css'

function AppFrame({ title, compact, settingsFields, settings, onSettingsChange, onHide, children }) {
  const [isEditing, setIsEditing] = useState(false)

  function handleToggleSettings() {
    if (isEditing) {
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  let body = null
  if (isEditing) {
    body = (
      <div className="app-frame-body app-frame-settings">
        <SettingsFields fields={settingsFields} values={settings} onChange={onSettingsChange} />
      </div>
    )
  } else {
    body = <div className="app-frame-body">{children}</div>
  }

  let settingsButton = null
  if (settingsFields.length > 0) {
    settingsButton = (
      <button className="app-frame-button" onClick={handleToggleSettings} title="Settings">
        ⚙
      </button>
    )
  }

  const buttons = (
    <div className="app-frame-buttons">
      {settingsButton}
      <button className="app-frame-button" onClick={onHide} title="Hide this app">
        ✕
      </button>
    </div>
  )

  // "app-drag-handle" is the part you can drag the App by (see Board.jsx).
  if (compact) {
    return (
      <div className="app-frame app-frame-compact app-drag-handle">
        {body}
        {buttons}
      </div>
    )
  }

  return (
    <div className="app-frame">
      <div className="app-frame-bar app-drag-handle">
        <span className="app-frame-title">{title}</span>
        {buttons}
      </div>
      {body}
    </div>
  )
}

export default AppFrame
