// Pomodoro: a focus timer. 25 minutes focus, then a 5 minute break.
import { useState, useEffect } from 'react'
import './Pomodoro.css'

const FOCUS_MINUTES = 25
const BREAK_MINUTES = 5

// Works out the next second of the timer.
// When time runs out, it switches between focus and break.
function nextTick(current) {
  if (current.secondsLeft > 1) {
    return { mode: current.mode, secondsLeft: current.secondsLeft - 1 }
  } else if (current.mode === 'focus') {
    return { mode: 'break', secondsLeft: BREAK_MINUTES * 60 }
  } else {
    return { mode: 'focus', secondsLeft: FOCUS_MINUTES * 60 }
  }
}

function Pomodoro() {
  const [timer, setTimer] = useState({ mode: 'focus', secondsLeft: FOCUS_MINUTES * 60 })
  const [isRunning, setIsRunning] = useState(false)

  // Count down once a second while running.
  useEffect(function () {
    if (!isRunning) {
      return
    }

    const interval = setInterval(function () {
      setTimer(nextTick)
    }, 1000)

    return function () {
      clearInterval(interval)
    }
  }, [isRunning])

  function handleStartPause() {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
    }
  }

  function handleReset() {
    setIsRunning(false)
    setTimer({ mode: 'focus', secondsLeft: FOCUS_MINUTES * 60 })
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
  if (isRunning) {
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
