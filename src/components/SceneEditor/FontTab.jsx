// FontTab: the "Font" tab of the scene editor. Pick the font pair.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { fontList } from '../../themes/fonts.js'
import { lookText } from '../../content/menu-bar.js'

function FontTab({ settings, onSettingsChange }) {
  function handlePickFont(id) {
    onSettingsChange({ ...settings, fontId: id })
  }

  return (
    <>
      <ChoiceList options={fontList} selectedId={settings.fontId} onPick={handlePickFont} />
      <p className="scene-editor-hint">{lookText.fontHint}</p>
    </>
  )
}

export default FontTab
