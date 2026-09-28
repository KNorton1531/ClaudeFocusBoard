// Welcome: the greeting pinned to the top left.
// Always uses the real date and time (settings can't override it).
import { useState, useEffect } from 'react'
import { pickWelcome } from './pickWelcome.js'
import './Welcome.css'

function Welcome({ name }) {
  const [now, setNow] = useState(function () {
    return new Date()
  })

  // Check the time once a minute.
  useEffect(function () {
    const timer = setInterval(function () {
      setNow(new Date())
    }, 60 * 1000)

    return function () {
      clearInterval(timer)
    }
  }, [])

  const welcome = pickWelcome(now, name)

  let subHeader = null
  if (welcome.sub) {
    subHeader = <p className="welcome-sub">{welcome.sub}</p>
  }

  return (
    <div className="welcome">
      <h1 className="welcome-header">{welcome.header}</h1>
      {subHeader}
    </div>
  )
}

export default Welcome
