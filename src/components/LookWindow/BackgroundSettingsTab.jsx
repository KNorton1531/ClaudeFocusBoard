// BackgroundSettingsTab: the "Background settings" tab of the Look window.
// Turn the video background on or off, and open the scene editor to fit the
// background to the screen (see components/SceneEditor/).
import { lookText } from '../../content/menu-bar.js'
import { framingText } from '../../content/background-framing.js'

function BackgroundSettingsTab({ settings, onSettingsChange, onAdjustScene }) {
  function handleToggleVideo(event) {
    onSettingsChange({ ...settings, lofiVideoBackground: event.target.checked })
  }

  return (
    <>
      <div className="menu-section">
        <h3 className="menu-section-title">{lookText.videoTitle}</h3>
        <label className="background-settings-toggle">
          <span>{lookText.videoToggle}</span>
          <input type="checkbox" checked={settings.lofiVideoBackground} onChange={handleToggleVideo} />
        </label>
      </div>

      <div className="menu-section">
        <h3 className="menu-section-title">{framingText.title}</h3>
        <button className="background-settings-adjust" onClick={onAdjustScene}>
          ⤢ {framingText.adjust}
        </button>
        <p className="menu-hint">{framingText.hint}</p>
      </div>
    </>
  )
}

export default BackgroundSettingsTab
