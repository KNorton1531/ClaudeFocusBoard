// AddCountdownForm: a name, a date, and "Every year", to add your own countdown.
// Shown at the top of "My countdowns" in the Choose panel.
import { useState } from 'react'
import { countdownText } from '../../content/countdown.js'
import { findNext } from './countdownInfo.js'

function AddCountdownForm({ now, onAdd }) {
  const [name, setName] = useState('')
  // The date box gives "YYYY-MM-DD", or '' if nothing is picked.
  const [date, setDate] = useState('')
  const [isEveryYear, setIsEveryYear] = useState(false)
  const [problem, setProblem] = useState('')

  function handleAdd(event) {
    // Stops the form reloading the page.
    event.preventDefault()

    if (name.trim() === '') {
      setProblem(countdownText.noName)
      return
    }

    if (date === '') {
      setProblem(countdownText.noDate)
      return
    }

    // Saved the same way as the built-in ones: "MM-DD" for every year,
    // "YYYY-MM-DD" for one day only. See src/content/countdown-list.js.
    let savedDate = date
    if (isEveryYear) {
      savedDate = date.slice(5)
    }

    const countdown = { id: 'mine-' + Date.now(), name: name.trim(), category: 'mine', date: savedDate }

    if (findNext(countdown, now) === null) {
      setProblem(countdownText.alreadyPassed)
      return
    }

    onAdd(countdown)
    setName('')
    setDate('')
    setIsEveryYear(false)
    setProblem('')
  }

  let problemArea = null
  if (problem !== '') {
    problemArea = <p className="countdown-problem">{problem}</p>
  }

  return (
    <form className="countdown-form" onSubmit={handleAdd}>
      <input
        className="countdown-input"
        type="text"
        value={name}
        placeholder={countdownText.namePlaceholder}
        onChange={function (event) {
          setName(event.target.value)
        }}
      />
      <div className="countdown-form-row">
        <input
          className="countdown-input"
          type="date"
          value={date}
          onChange={function (event) {
            setDate(event.target.value)
          }}
        />
        <label className="countdown-every-year">
          <input
            type="checkbox"
            checked={isEveryYear}
            onChange={function (event) {
              setIsEveryYear(event.target.checked)
            }}
          />
          {countdownText.everyYear}
        </label>
        <button className="countdown-pill" type="submit">
          {countdownText.add}
        </button>
      </div>
      {problemArea}
    </form>
  )
}

export default AddCountdownForm
