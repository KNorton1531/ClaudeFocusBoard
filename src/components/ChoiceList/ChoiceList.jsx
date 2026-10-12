// ChoiceList: a row of buttons where exactly one is picked.
// Used for backgrounds, themes and effects.
import './ChoiceList.css'

function ChoiceList({ options, selectedId, onPick }) {
  const buttons = options.map(function (option) {
    let className = 'choice'
    if (option.id === selectedId) {
      className = 'choice choice-picked'
    }

    return (
      <button
        key={option.id}
        className={className}
        onClick={function () {
          onPick(option.id)
        }}
      >
        {option.name}
      </button>
    )
  })

  return <div className="choice-list">{buttons}</div>
}

export default ChoiceList
