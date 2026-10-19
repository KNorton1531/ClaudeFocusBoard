// BoardingPass: one flight, set out like a boarding pass.
// Top: the airline's logo, flight number and airline. Middle: from and to, with
// the plane drawn along the line as far as it has flown. Below the tear line: altitude, speed
// and how far away it is, then which way to look to spot it.
import { flightText, compassNames } from '../../content/flight.js'
import { milesBetween } from './flightApi.js'
import { airlineCode } from './airlineLook.js'
import { useAirlineLook } from './useAirlineLook.js'
import { useAircraftDetails } from './useAircraftDetails.js'
import AirlineLogo from './AirlineLogo.jsx'

const KM_PER_MILE = 1.60934

// How far along its trip the plane is, from 0 to 100.
function tripProgress(plane, route) {
  const flown = milesBetween(route.from.latitude, route.from.longitude, plane.latitude, plane.longitude)
  const left = milesBetween(plane.latitude, plane.longitude, route.to.latitude, route.to.longitude)

  if (flown + left === 0) {
    return 0
  }

  return Math.round((flown / (flown + left)) * 100)
}

// Climbing, descending or cruising, from how fast it's going up or down.
function climbStatus(climbRate) {
  if (climbRate > 500) {
    return flightText.climbing
  } else if (climbRate < -500) {
    return flightText.descending
  } else {
    return flightText.cruising
  }
}

// 0 degrees is north, 45 is north-east, and so on round the compass.
function compassName(degrees) {
  const slice = Math.round(degrees / 45) % 8
  return compassNames[slice]
}

function BoardingPass({ plane, route, units, position, total, onNext }) {
  const progress = tripProgress(plane, route)
  const code = airlineCode(plane.callsign)

  // The airline's logo, and its colour taken from the logo, which tints the pass.
  // Until they're found (or if there aren't any) there's no logo and the theme's accent is used.
  const look = useAirlineLook(code)

  let logo = null
  let passStyle = {}
  if (look) {
    logo = <AirlineLogo logo={look.logo} airline={route.airline} />

    if (look.colour) {
      passStyle = { '--flight-colour': look.colour }
    }
  }

  let speed = plane.speedMph + ' mph'
  let away = plane.awayMiles.toFixed(1) + ' mi'
  if (units === 'km') {
    speed = Math.round(plane.speedMph * KM_PER_MILE) + ' km/h'
    away = (plane.awayMiles * KM_PER_MILE).toFixed(1) + ' km'
  }

  const altitude = plane.altitudeFeet.toLocaleString('en-GB') + ' ft'

  // The plane slides along the line, and the line behind it is filled in.
  const planeStyle = { left: progress + '%' }
  const flownStyle = { width: progress + '%' }

  // The arrow points the way to look. It starts pointing up (north).
  const arrowStyle = { transform: 'rotate(' + plane.direction + 'deg)' }

  // The › button only shows when there's another flight to move on to.
  let nextButton = null
  if (total > 1) {
    nextButton = (
      <button className="flight-next" title={flightText.nextFlight} onClick={onNext}>
        <span>
          {position} / {total}
        </span>
        <span className="flight-next-arrow">›</span>
      </button>
    )
  }

  const details = useAircraftDetails(plane)

  return (
    <div className="flight" style={passStyle}>
      <div className="flight-top">
        {logo}
        <span className="flight-number">{route.flightNumber}</span>
        <span className="flight-airline">{route.airline}</span>
      </div>

      <div className="flight-route">
        <div className="flight-airport" title={route.from.name}>
          <span className="flight-label">{flightText.from}</span>
          <span className="flight-code">{route.from.code}</span>
          <span className="flight-city">{route.from.city}</span>
        </div>

        <div className="flight-path">
          <div className="flight-path-line" />
          <div className="flight-path-flown" style={flownStyle} />
          {/* An SVG, not the ✈ character, so it sits exactly on the line. */}
          <svg className="flight-path-plane" style={planeStyle} viewBox="0 0 24 24" aria-hidden="true">
            <path
              transform="rotate(90 11.5 12)"
              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
            />
          </svg>
        </div>

        <div className="flight-airport flight-airport-to" title={route.to.name}>
          <span className="flight-label">{flightText.to}</span>
          <span className="flight-code">{route.to.code}</span>
          <span className="flight-city">{route.to.city}</span>
        </div>
      </div>

      <div className="flight-tear" />

      <div className="flight-stats">
        <div className="flight-stat">
          <span className="flight-label">{flightText.altitude}</span>
          <span className="flight-stat-value">{altitude}</span>
        </div>
        <div className="flight-stat">
          <span className="flight-label">{flightText.speed}</span>
          <span className="flight-stat-value">{speed}</span>
        </div>
        <div className="flight-stat">
          <span className="flight-label">{flightText.away}</span>
          <span className="flight-stat-value">{away}</span>
        </div>
      </div>

      <div className="flight-bottom">
        <div className="flight-look">
          <span className="flight-compass" style={arrowStyle}>
            ↑
          </span>
          <span>
            {flightText.look} {compassName(plane.direction)} · {climbStatus(plane.climbRate)}
          </span>
        </div>
        {nextButton}
      </div>

      <div className="flight-model">{details}</div>
    </div>
  )
}

export default BoardingPass
