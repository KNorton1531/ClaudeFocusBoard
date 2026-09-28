// SettingsBar: the small bar in the top right.
// Add an App, pick a background, and set your name.
import { appList } from '../../apps/index.js'
import { backgroundList } from '../../backgrounds/index.js'
import './SettingsBar.css'

function SettingsBar({ settings, onSettingsChange, onAddApp }) {
  const appOptions = appList.map(function (app) {
    return (
      <option key={app.type} value={app.type}>
        {app.name}
      </option>
    )
  })

  const backgroundOptions = backgroundList.map(function (background) {
    return (
      <option key={background.id} value={background.id}>
        {background.name}
      </option>
    )
  })

  function handleAddApp(event) {
    if (event.target.value !== '') {
      onAddApp(event.target.value)
      event.target.value = ''
    }
  }

  function handleBackgroundChange(event) {
    onSettingsChange({ ...settings, backgroundId: event.target.value })
  }

  function handleNameChange(event) {
    onSettingsChange({ ...settings, name: event.target.value })
  }

  return (
    <div className="settings-bar">
      <select className="settings-control" value="" onChange={handleAddApp}>
        <option value="">+ Add app</option>
        {appOptions}
      </select>

      <select className="settings-control" value={settings.backgroundId} onChange={handleBackgroundChange}>
        {backgroundOptions}
      </select>

      <input
        className="settings-control"
        type="text"
        value={settings.name}
        onChange={handleNameChange}
        placeholder="Your name"
      />
    </div>
  )
}

export default SettingsBar
