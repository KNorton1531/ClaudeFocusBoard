// Pomodoro: a focus timer. The lengths come from the App's settings.
import { useState, useEffect } from 'react'
import './Pomodoro.css'

// Works out the next second of the timer.
// When the time runs out it swaps between focus and break, and only keeps
// running if the settings say to start the next round on its own.
function nextTick(current, settings) {
  if (current.secondsLeft > 1) {
    return { mode: current.mode, secondsLeft: current.secondsLeft - 1, isRunning: true }
  }

  if (current.mode === 'focus') {
    return { mode: 'break', secondsLeft: settings.breakMinutes * 60, isRunning: settings.autoStartNext }
  } else {
    return { mode: 'focus', secondsLeft: settings.focusMinutes * 60, isRunning: settings.autoStartNext }
  }
}

// A fresh timer, ready at the start of a focus round.
function makeTimer(settings) {
  return { mode: 'focus', secondsLeft: settings.focusMinutes * 60, isRunning: false }
}

function Pomodoro({ settings }) {
  const [timer, setTimer] = useState(function () {
    return makeTimer(settings)
  })

  // Remembers which lengths the timer was built with, so we can spot a change.
  const [builtWith, setBuiltWith] = useState(settings.focusMinutes + '-' + settings.breakMinutes)
  const nowBuiltWith = settings.focusMinutes + '-' + settings.breakMinutes

  // If the lengths were changed in settings, start again with the new ones.
  if (builtWith !== nowBuiltWith) {
    setBuiltWith(nowBuiltWith)
    setTimer(makeTimer(settings))
  }

  // Count down once a second while running.
  useEffect(
    function () {
      if (!timer.isRunning) {
        return
      }

      const interval = setInterval(function () {
        setTimer(function (current) {
          return nextTick(current, settings)
        })
      }, 1000)

      return function () {
        clearInterval(interval)
      }
    },
    [timer.isRunning, settings],
  )

  function handleStartPause() {
    if (timer.isRunning) {
      setTimer({ ...timer, isRunning: false })
    } else {
      setTimer({ ...timer, isRunning: true })
    }
  }

  function handleReset() {
    setTimer(makeTimer(settings))
  }

  const minutes = String(Math.floor(timer.secondsLeft / 60)).padStart(2, '0')
  const seconds = String(timer.secondsLeft % 60).padStart(2, '0')

  let modeLabel = ''
  if (timer.mode === 'focus') {
    modeLabel = 'Focus'
  } else {
    modeLabel = 'Break'
  }

  let buttonLabel = ''
  if (timer.isRunning) {
    buttonLabel = 'Pause'
  } else {
    buttonLabel = 'Start'
  }

  return (
    <div className="pomodoro">
      <div className="pomodoro-mode">{modeLabel}</div>
      <div className="pomodoro-time">
        {minutes}:{seconds}
      </div>
      <div className="pomodoro-buttons">
        <button className="pomodoro-button" onClick={handleStartPause}>
          {buttonLabel}
        </button>
        <button className="pomodoro-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default Pomodoro
