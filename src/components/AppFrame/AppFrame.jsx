// AppFrame: the frosted card every App sits inside.
// The title bar is the drag handle. The x button removes the App.
import './AppFrame.css'

function AppFrame({ title, onClose, children }) {
  return (
    <div className="app-frame">
      <div className="app-frame-bar">
        <span className="app-frame-title">{title}</span>
        <button className="app-frame-close" onClick={onClose} title="Remove app">
          ✕
        </button>
      </div>
      <div className="app-frame-body">{children}</div>
    </div>
  )
}

export default AppFrame
