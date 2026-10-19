// BackgroundsTab: the "Backgrounds" tab of the Look window. Pick the background.
// "Try on screen" opens the scene editor, to flip through them with nothing in the way.
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker.jsx'
import { framingText } from '../../content/background-framing.js'

function BackgroundsTab({ settings, onSettingsChange, onAdjustScene }) {
  function handlePickBackground(id) {
    onSettingsChange({ ...settings, backgroundId: id })
  }

  return (
    <>
      <BackgroundPicker selectedId={settings.backgroundId} onPick={handlePickBackground} layout="grid" />
      <button className="background-settings-adjust background-try-on-screen" onClick={onAdjustScene}>
        ⤢ {framingText.tryOnScreen}
      </button>
    </>
  )
}

export default BackgroundsTab
