// EffectsTab: the "Effects" tab of the scene editor. Pick the weather effect, like rain or snow.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { effectList } from '../../effects/index.js'
import { lookText } from '../../content/menu-bar.js'

function EffectsTab({ settings, onSettingsChange }) {
  function handlePickEffect(id) {
    onSettingsChange({ ...settings, effectId: id })
  }

  return (
    <>
      <ChoiceList options={effectList} selectedId={settings.effectId} onPick={handlePickEffect} />
      <p className="scene-editor-hint">{lookText.effectsHint}</p>
    </>
  )
}

export default EffectsTab
