// AppFrame: the frosted card every grid App sits inside.
// The title bar is the drag handle. The buttons open settings, hide the App,
// or remove it. Pressing the gear flips the card over to show its settings.
import { useState } from 'react'
import SettingsFields from '../SettingsFields/SettingsFields.jsx'
import './AppFrame.css'

function AppFrame({ title, settingsFields, settings, onSettingsChange, onHide, onRemove, children }) {
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

  return (
    <div className="app-frame">
      <div className="app-frame-bar">
        <span className="app-frame-title">{title}</span>
        <div className="app-frame-buttons">
          {settingsButton}
          <button className="app-frame-button" onClick={onHide} title="Hide this app">
            –
          </button>
          <button className="app-frame-button" onClick={onRemove} title="Remove this app">
            ✕
          </button>
        </div>
      </div>
      {body}
    </div>
  )
}

export default AppFrame
