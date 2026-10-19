// BackgroundPicker: every background as a little picture you can click.
// One row you can scroll, in the scene editor.
import { backgroundList } from '../../backgrounds/index.js'
import './BackgroundPicker.css'

function BackgroundPicker({ selectedId, onPick }) {
  const cards = backgroundList.map(function (background) {
    let className = 'background-card'
    if (background.id === selectedId) {
      className = 'background-card background-card-picked'
    }

    return (
      <button
        key={background.id}
        className={className}
        title={background.name}
        onClick={function () {
          onPick(background.id)
        }}
      >
        <img className="background-card-picture" src={background.image} alt="" />
        <span className="background-card-name">{background.name}</span>
      </button>
    )
  })

  return <div className="background-picker">{cards}</div>
}

export default BackgroundPicker
