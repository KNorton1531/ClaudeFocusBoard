// ColoursTab: the "Colours" tab of the scene editor. Pick the theme.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { themeList } from '../../themes/index.js'
import { lookText } from '../../content/menu-bar.js'

function ColoursTab({ settings, onSettingsChange }) {
  function handlePickTheme(id) {
    onSettingsChange({ ...settings, themeId: id })
  }

  return (
    <>
      <ChoiceList options={themeList} selectedId={settings.themeId} onPick={handlePickTheme} />
      <p className="scene-editor-hint">{lookText.coloursHint}</p>
    </>
  )
}

export default ColoursTab
