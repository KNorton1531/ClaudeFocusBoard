// AppSettingsMenu: the settings for one App, in a pop-up menu panel.
// Used by floating Apps (like the clock), which are too small to show
// their settings inside themselves.
import MenuPanel from '../MenuPanel/MenuPanel.jsx'
import SettingsFields from '../SettingsFields/SettingsFields.jsx'
import { findApp } from '../../apps/index.js'

function AppSettingsMenu({ app, onClose, onSettingsChange }) {
  const appInfo = findApp(app.type)

  return (
    <MenuPanel title={appInfo.name + ' settings'} onClose={onClose}>
      <SettingsFields fields={appInfo.settingsFields} values={app.settings} onChange={onSettingsChange} />
    </MenuPanel>
  )
}

export default AppSettingsMenu
