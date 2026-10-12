// Clock: shows the time and today's date. Can show another city's time.
import { useState, useEffect } from 'react'
import './Clock.css'

function Clock({ settings }) {
  const [now, setNow] = useState(function () {
    return new Date()
  })

  useEffect(function () {
    const timer = setInterval(function () {
      setNow(new Date())
    }, 1000)

    return function () {
      clearInterval(timer)
    }
  }, [])

  // Build the options for toLocaleTimeString from the settings.
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: !settings.hour24 }

  if (settings.showSeconds) {
    timeOptions.second = '2-digit'
  }

  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' }

  // "local" means don't pass a time zone at all, so the browser uses this computer's.
  if (settings.timeZone !== 'local') {
    timeOptions.timeZone = settings.timeZone
    dateOptions.timeZone = settings.timeZone
  }

  const time = now.toLocaleTimeString([], timeOptions)

  // Minimal mode shows only the time, so the label and date are skipped.
  let label = null
  let date = null
  if (!settings.minimal) {
    if (settings.label) {
      label = <div className="clock-label">{settings.label}</div>
    }

    if (settings.showDate) {
      date = <div className="clock-date">{now.toLocaleDateString([], dateOptions)}</div>
    }
  }

  return (
    <div className={'clock clock-size-' + settings.size}>
      {label}
      <div className="clock-time">{time}</div>
      {date}
    </div>
  )
}

export default Clock
