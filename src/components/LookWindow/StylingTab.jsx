// StylingTab: the "Styling" tab of the Look window. Pick the theme colours.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { themeList } from '../../themes/index.js'
import { lookText } from '../../content/menu-bar.js'

function StylingTab({ settings, onSettingsChange }) {
  function handlePickTheme(id) {
    onSettingsChange({ ...settings, themeId: id })
  }

  return (
    <div className="menu-section">
      <h3 className="menu-section-title">{lookText.themeTitle}</h3>
      <ChoiceList options={themeList} selectedId={settings.themeId} onPick={handlePickTheme} />
    </div>
  )
}

export default StylingTab
