// BackgroundPicker: every background as a little picture you can click.
// Used in the Look window's Backgrounds tab (as a grid) and in the scene
// editor (as one row you can scroll).
// "layout" is 'grid' or 'strip'.
import { backgroundList } from '../../backgrounds/index.js'
import './BackgroundPicker.css'

function BackgroundPicker({ selectedId, onPick, layout }) {
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

  return <div className={'background-picker background-picker-' + layout}>{cards}</div>
}

export default BackgroundPicker
