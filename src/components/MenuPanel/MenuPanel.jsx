// MenuPanel: the plain card every menu is drawn inside.
// It gives each menu the same look, title and close button.
import './MenuPanel.css'

function MenuPanel({ title, onClose, children }) {
  return (
    <div className="menu-panel">
      <div className="menu-panel-head">
        <h2 className="menu-panel-title">{title}</h2>
        <button className="menu-panel-close" onClick={onClose} title="Close">
          ✕
        </button>
      </div>
      <div className="menu-panel-body">{children}</div>
    </div>
  )
}

export default MenuPanel
