// MenuBar: the row of buttons beside the music bar that open the windows.
// Only one window is open at a time. The buttons are listed in content/menu-bar.js.
import { menuBarButtons } from '../../content/menu-bar.js'
import './MenuBar.css'

function MenuBar({ openMenu, onOpenMenu }) {
  const buttons = menuBarButtons.map(function (button) {
    let className = 'menu-bar-button'
    if (button.id === openMenu) {
      className = 'menu-bar-button menu-bar-button-open'
    }

    return (
      <button
        key={button.id}
        className={className}
        title={button.name}
        onClick={function () {
          onOpenMenu(button.id)
        }}
      >
        <span className="menu-bar-icon">{button.icon}</span>
        <span className="menu-bar-name">{button.name}</span>
      </button>
    )
  })

  return <div className="menu-bar">{buttons}</div>
}

export default MenuBar
