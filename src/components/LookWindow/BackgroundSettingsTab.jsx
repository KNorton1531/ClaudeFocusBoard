// BackgroundSettingsTab: the "Background settings" tab of the Look window.
// Turn the video background on or off, and fit the background to the screen
// (see backgrounds/framing.js).
import FramingControls from '../FramingControls/FramingControls.jsx'
import { findBackground } from '../../backgrounds/index.js'
import { findFraming, VIDEO_FRAMING_KEY } from '../../backgrounds/framing.js'
import { framingText } from '../../content/background-framing.js'
import { lookText } from '../../content/menu-bar.js'

function BackgroundSettingsTab({ settings, onSettingsChange }) {
  function handleToggleVideo(event) {
    onSettingsChange({ ...settings, lofiVideoBackground: event.target.checked })
  }

  // The fit controls change the video when it's the background, otherwise the picture.
  const background = findBackground(settings.backgroundId)
  let framingKey = background.id
  let framingName = background.name

  if (settings.lofiVideoBackground) {
    framingKey = VIDEO_FRAMING_KEY
    framingName = framingText.videoName
  }

  function handleFramingChange(newFraming) {
    const allFraming = { ...settings.framing, [framingKey]: newFraming }
    onSettingsChange({ ...settings, framing: allFraming })
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
        <FramingControls
          name={framingName}
          framing={findFraming(settings.framing, framingKey)}
          onChange={handleFramingChange}
        />
        <p className="menu-hint">{framingText.hint}</p>
      </div>
    </>
  )
}

export default BackgroundSettingsTab
