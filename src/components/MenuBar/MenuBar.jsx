// MenuBar: the row of buttons beside the music bar that open the menus.
// Only one menu is open at a time.
import './MenuBar.css'

// The buttons, in the order they appear.
const BUTTONS = [
  { id: 'apps', name: 'Apps', icon: '▦' },
  { id: 'look', name: 'Look', icon: '✧' },
  { id: 'settings', name: 'Settings', icon: '⚙' },
]

function MenuBar({ openMenu, onOpenMenu }) {
  const buttons = BUTTONS.map(function (button) {
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
