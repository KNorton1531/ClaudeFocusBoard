// LookMenu: the "Look" menu.
// Pick the background, the theme colours, and the weather effect.
import MenuPanel from '../MenuPanel/MenuPanel.jsx'
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { backgroundList } from '../../backgrounds/index.js'
import { themeList } from '../../themes/index.js'
import { effectList } from '../../effects/index.js'

function LookMenu({ settings, onClose, onSettingsChange }) {
  function handlePickBackground(id) {
    onSettingsChange({ ...settings, backgroundId: id })
  }

  function handlePickTheme(id) {
    onSettingsChange({ ...settings, themeId: id })
  }

  function handlePickEffect(id) {
    onSettingsChange({ ...settings, effectId: id })
  }

  return (
    <MenuPanel title="Look" onClose={onClose}>
      <div className="menu-section">
        <h3 className="menu-section-title">Background</h3>
        <ChoiceList options={backgroundList} selectedId={settings.backgroundId} onPick={handlePickBackground} />
      </div>

      <div className="menu-section">
        <h3 className="menu-section-title">Theme</h3>
        <ChoiceList options={themeList} selectedId={settings.themeId} onPick={handlePickTheme} />
      </div>

      <div className="menu-section">
        <h3 className="menu-section-title">Effect</h3>
        <ChoiceList options={effectList} selectedId={settings.effectId} onPick={handlePickEffect} />
        <p className="menu-hint">
          Effects work on any background. The moving parts that belong to one scene, like the
          chimney smoke, are part of the background itself.
        </p>
      </div>
    </MenuPanel>
  )
}

export default LookMenu
