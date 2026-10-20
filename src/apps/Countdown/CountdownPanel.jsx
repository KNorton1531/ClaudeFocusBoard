// CountdownPanel: tick which countdowns to show, grouped by category,
// and add or remove your own. Shown inside the Countdown App when you press ☰.
import { countdownList, countdownCategories } from '../../content/countdown-list.js'
import { countdownText } from '../../content/countdown.js'
import { findNext, findIcon, formatDate } from './countdownInfo.js'
import AddCountdownForm from './AddCountdownForm.jsx'

function CountdownPanel({ mine, chosen, now, onToggle, onAdd, onRemove, onDone }) {
  const everyCountdown = [...countdownList, ...mine]

  function makeRow(countdown) {
    // When it's next on, or "Finished" if every day has passed.
    const next = findNext(countdown, now)
    let when = countdownText.finished
    if (next !== null) {
      when = formatDate(next.date)
    }

    // Only your own can be removed.
    let removeButton = null
    if (countdown.category === 'mine') {
      removeButton = (
        <button
          className="countdown-remove"
          title={countdownText.remove}
          onClick={function () {
            onRemove(countdown.id)
          }}
        >
          ✕
        </button>
      )
    }

    return (
      <li key={countdown.id} className="countdown-pick-row">
        <label className="countdown-pick">
          <input
            type="checkbox"
            checked={chosen.includes(countdown.id)}
            onChange={function () {
              onToggle(countdown.id)
            }}
          />
          <span className="countdown-pick-icon">{findIcon(countdown)}</span>
          <span className="countdown-pick-name">{countdown.name}</span>
          <span className="countdown-pick-when">{when}</span>
        </label>
        {removeButton}
      </li>
    )
  }

  const sections = countdownCategories.map(function (category) {
    const inCategory = everyCountdown.filter(function (countdown) {
      return countdown.category === category.id
    })

    // "My countdowns" always shows, so you can add to it. Other empty groups are skipped.
    let addForm = null
    let list = null
    if (category.id === 'mine') {
      addForm = <AddCountdownForm now={now} onAdd={onAdd} />

      if (inCategory.length === 0) {
        list = <p className="countdown-message">{countdownText.noneOfMine}</p>
      }
    } else if (inCategory.length === 0) {
      return null
    }

    if (list === null) {
      list = <ul className="countdown-pick-list">{inCategory.map(makeRow)}</ul>
    }

    return (
      <section key={category.id} className="countdown-section">
        <div className="countdown-panel-title">{category.name}</div>
        {addForm}
        {list}
      </section>
    )
  })

  return (
    <div className="countdown-panel">
      <div className="countdown-panel-top">
        <button className="countdown-pill" onClick={onDone}>
          {countdownText.done}
        </button>
        <span className="countdown-panel-title">{countdownText.choose}</span>
      </div>
      {sections}
    </div>
  )
}

export default CountdownPanel
