// Flight: an airliner flying near you right now, shown like a boarding pass.
// Finds where you are, asks the flight feed for planes nearby, then looks up
// each one's route. Only planes with a known route are shown, which keeps out
// private and military planes. The › button moves on to the next one.
import { useState, useEffect, useRef } from 'react'
import { flightText } from '../../content/flight.js'
import { getMyLocation } from '../../components/getMyLocation.js'
import { isFeedSetUp, fetchNearbyPlanes, fetchRoute } from './flightApi.js'
import BoardingPass from './BoardingPass.jsx'
import FlightMessage from './FlightMessage.jsx'
import './Flight.css'

const REFRESH_SECONDS = 30

// How many of the nearest planes to look up routes for. Keeps the number
// of requests small, while still giving a few flights to flick through.
const MAX_LOOKUPS = 8

function Flight({ settings }) {
  // Where we are. status is 'waiting', 'ready' or 'failed'.
  const [here, setHere] = useState({ status: 'waiting' })

  // Airliners near us, nearest first. status is 'waiting', 'ready' or 'failed'.
  const [nearby, setNearby] = useState({ status: 'waiting', planes: [] })

  // Routes found so far, by callsign. null means "not a known airline flight".
  const [routes, setRoutes] = useState({})

  // The plane on screen. It stays shown while it's still nearby.
  const [shownId, setShownId] = useState(null)

  // Callsigns already being looked up, so each is only asked for once.
  const askedRef = useRef(new Set())

  const radiusMiles = Number(settings.radius)

  // Ask the browser where we are.
  useEffect(function () {
    let isCurrent = true

    getMyLocation()
      .then(function (spot) {
        if (isCurrent) {
          setHere({ status: 'ready', latitude: spot.latitude, longitude: spot.longitude })
        }
      })
      .catch(function () {
        if (isCurrent) {
          setHere({ status: 'failed' })
        }
      })

    return function () {
      isCurrent = false
    }
  }, [])

  // Get the planes nearby, then again every few seconds.
  useEffect(
    function () {
      if (here.status !== 'ready') {
        return
      }

      if (!isFeedSetUp()) {
        return
      }

      let isCurrent = true

      function load() {
        fetchNearbyPlanes(here.latitude, here.longitude, radiusMiles)
          .then(function (planes) {
            if (isCurrent) {
              setNearby({ status: 'ready', planes: planes })
            }
          })
          .catch(function () {
            if (!isCurrent) {
              return
            }

            setNearby(function (current) {
              // If a refresh fails, keep showing the last planes we had.
              if (current.status === 'ready') {
                return current
              } else {
                return { status: 'failed', planes: [] }
              }
            })
          })
      }

      load()
      const interval = setInterval(load, REFRESH_SECONDS * 1000)

      return function () {
        isCurrent = false
        clearInterval(interval)
      }
    },
    [here, radiusMiles],
  )

  // Look up the route of each of the nearest planes we haven't asked about yet.
  useEffect(
    function () {
      const nearest = nearby.planes.slice(0, MAX_LOOKUPS)

      for (const plane of nearest) {
        const callsign = plane.callsign

        if (!askedRef.current.has(callsign)) {
          askedRef.current.add(callsign)

          fetchRoute(callsign)
            .then(function (route) {
              setRoutes(function (current) {
                return { ...current, [callsign]: route }
              })
            })
            .catch(function () {
              // The lookup itself failed, so try again on the next refresh.
              askedRef.current.delete(callsign)
            })
        }
      }
    },
    [nearby],
  )

  if (!isFeedSetUp()) {
    return <FlightMessage text={flightText.notSetUp} />
  }

  if (here.status === 'waiting') {
    return <FlightMessage text={flightText.findingYou} />
  }

  if (here.status === 'failed') {
    return <FlightMessage text={flightText.locationFailed} />
  }

  if (nearby.status === 'waiting') {
    return <FlightMessage text={flightText.loading} />
  }

  if (nearby.status === 'failed') {
    return <FlightMessage text={flightText.loadFailed} />
  }

  // The flights we can show: nearby planes whose route we know.
  const flights = nearby.planes.filter(function (plane) {
    if (routes[plane.callsign]) {
      return true
    } else {
      return false
    }
  })

  if (flights.length === 0) {
    // Still waiting on some routes? Then keep looking, rather than giving up.
    let isStillChecking = false
    for (const plane of nearby.planes.slice(0, MAX_LOOKUPS)) {
      if (!(plane.callsign in routes)) {
        isStillChecking = true
      }
    }

    if (isStillChecking) {
      return <FlightMessage text={flightText.loading} />
    } else {
      return <FlightMessage text={flightText.noFlights} />
    }
  }

  // Keep showing the same plane if it's still around. If not, show the nearest.
  let shownIndex = 0
  for (let i = 0; i < flights.length; i = i + 1) {
    if (flights[i].id === shownId) {
      shownIndex = i
    }
  }

  const shown = flights[shownIndex]

  function handleNext() {
    const next = flights[(shownIndex + 1) % flights.length]
    setShownId(next.id)
  }

  return (
    <BoardingPass
      plane={shown}
      route={routes[shown.callsign]}
      units={settings.units}
      position={shownIndex + 1}
      total={flights.length}
      onNext={handleNext}
    />
  )
}

export default Flight
