// AppSettingsMenu: the settings for one App, in a pop-up window.
// Used by floating Apps (like the clock), which are too small to show
// their settings inside themselves.
import Window from '../Window/Window.jsx'
import SettingsFields from '../SettingsFields/SettingsFields.jsx'
import { findApp } from '../../apps/index.js'

function AppSettingsMenu({ app, onClose, onSettingsChange }) {
  const appInfo = findApp(app.type)

  return (
    <Window title={appInfo.name + ' settings'} onClose={onClose}>
      <SettingsFields fields={appInfo.settingsFields} values={app.settings} onChange={onSettingsChange} />
    </Window>
  )
}

export default AppSettingsMenu
