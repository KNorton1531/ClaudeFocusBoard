// Clock: shows the time and today's date.
import { useState, useEffect } from 'react'
import './Clock.css'

function Clock() {
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

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="clock">
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
    </div>
  )
}

export default Clock
