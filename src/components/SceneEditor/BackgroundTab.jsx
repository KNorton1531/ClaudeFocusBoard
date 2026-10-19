// BackgroundTab: the "Background" tab of the scene editor.
// Pick the background, fill or fit, centre it, and turn the video background on or off.
// Dragging the picture itself is handled by SceneEditor.jsx.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker.jsx'
import { DEFAULT_FRAMING } from '../../backgrounds/framing.js'
import { fitOptions, framingText } from '../../content/background-framing.js'
import { lookText } from '../../content/menu-bar.js'

function BackgroundTab({ settings, onSettingsChange, framing, framingName, onChangeFraming }) {
  // Picking a picture means you want to see it, so the video background turns off.
  function handlePickBackground(id) {
    onSettingsChange({ ...settings, backgroundId: id, lofiVideoBackground: false })
  }

  function handleToggleVideo(event) {
    onSettingsChange({ ...settings, lofiVideoBackground: event.target.checked })
  }

  function handlePickFit(id) {
    onChangeFraming({ ...framing, fit: id })
  }

  function handleCentre() {
    onChangeFraming(DEFAULT_FRAMING)
  }

  // With the video on, no picture is the background, so none is picked.
  let pickedBackgroundId = settings.backgroundId
  if (settings.lofiVideoBackground) {
    pickedBackgroundId = ''
  }

  return (
    <>
      <BackgroundPicker selectedId={pickedBackgroundId} onPick={handlePickBackground} />

      <p className="scene-editor-hint">
        {framingText.editing} <strong>{framingName}</strong>. {framingText.dragHint}
      </p>

      <div className="scene-editor-controls">
        <ChoiceList options={fitOptions} selectedId={framing.fit} onPick={handlePickFit} />
        <button className="scene-editor-button" onClick={handleCentre}>
          {framingText.centre}
        </button>
      </div>

      <label className="scene-editor-toggle">
        <span>{lookText.videoToggle}</span>
        <input type="checkbox" checked={settings.lofiVideoBackground} onChange={handleToggleVideo} />
      </label>
    </>
  )
}

export default BackgroundTab
