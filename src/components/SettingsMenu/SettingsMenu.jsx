// SettingsMenu: the "Settings" window. Things about you and the board itself.
import Window from '../Window/Window.jsx'
import './SettingsMenu.css'

function SettingsMenu({ settings, onClose, onSettingsChange, onResetBoard }) {
  function handleNameChange(event) {
    onSettingsChange({ ...settings, name: event.target.value })
  }

  return (
    <Window title="Settings" onClose={onClose}>
      <div className="menu-section">
        <h3 className="menu-section-title">Your name</h3>
        <input
          className="settings-menu-input"
          type="text"
          value={settings.name}
          onChange={handleNameChange}
          placeholder="Your name"
        />
        <p className="menu-hint">Used in the welcome message at the top left.</p>
      </div>

      <div className="menu-section">
        <h3 className="menu-section-title">Board</h3>
        <button className="settings-menu-reset" onClick={onResetBoard}>
          Reset the board
        </button>
        <p className="menu-hint">Puts the apps back to how they started.</p>
      </div>
    </Window>
  )
}

export default SettingsMenu
