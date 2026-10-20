// Flight: an airliner flying near you right now, shown like a boarding pass.
// Finds where you are, asks the flight feed for planes nearby, then looks up
// each one's route. Only planes with a known route are shown, which keeps out
// private and military planes. The › button moves on to the next one.
// If the browser can't tell us where you are, you can pick a place instead.
// It's saved under 'flight-<appId>' and only used when your location isn't found.
import { useState, useEffect, useRef } from 'react'
import { loadData, saveData } from '../../storage/storage.js'
import { flightText } from '../../content/flight.js'
import { getMyLocation } from '../../components/getMyLocation.js'
import { isFeedSetUp, fetchNearbyPlanes, fetchRoute } from './flightApi.js'
import { loadSavedPlanes, savePlanes } from './savedPlanes.js'
import BoardingPass from './BoardingPass.jsx'
import FlightMessage from './FlightMessage.jsx'
import PlacePicker from './PlacePicker.jsx'
import './Flight.css'

// Each ask keeps the flight feed (on Deno Deploy) awake, and the free plan
// only allows so much awake time. So don't ask too often.
const REFRESH_SECONDS = 120

// Saved planes younger than this are used instead of asking the feed.
// A little under REFRESH_SECONDS, so the regular refresh still asks.
const SAVED_PLANES_SECONDS = REFRESH_SECONDS - 10

// How many of the nearest planes to look up routes for. Keeps the number
// of requests small, while still giving a few flights to flick through.
const MAX_LOOKUPS = 8

function Flight({ appId, settings }) {
  const storageKey = 'flight-' + appId

  // Where we are. status is 'waiting', 'ready' or 'failed'.
  const [here, setHere] = useState({ status: 'waiting' })

  // The place you picked, for when your location can't be found. null if none.
  const [picked, setPicked] = useState(function () {
    const fromStorage = loadData(storageKey)

    if (fromStorage) {
      return fromStorage
    } else {
      return null
    }
  })

  // True while the place search is open.
  const [isPicking, setIsPicking] = useState(false)

  // Airliners near us, nearest first. status is 'waiting', 'ready' or 'failed'.
  const [nearby, setNearby] = useState({ status: 'waiting', planes: [] })

  // Routes found so far, by callsign. null means "not a known airline flight".
  const [routes, setRoutes] = useState({})

  // The plane on screen. It stays shown while it's still nearby.
  const [shownId, setShownId] = useState(null)

  // Callsigns already being looked up, so each is only asked for once.
  const askedRef = useRef(new Set())

  const radiusMiles = Number(settings.radius)

  // The spot to look for planes around: your location if we have it,
  // or else the place you picked. Stays null until we know one.
  let latitude = null
  let longitude = null
  let isUsingPicked = false
  if (here.status === 'ready') {
    latitude = here.latitude
    longitude = here.longitude
  } else if (here.status === 'failed' && picked !== null) {
    latitude = picked.latitude
    longitude = picked.longitude
    isUsingPicked = true
  }

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

  // Get the planes nearby, then again every couple of minutes.
  useEffect(
    function () {
      if (latitude === null) {
        return
      }

      if (!isFeedSetUp()) {
        return
      }

      let isCurrent = true

      // A new spot? Don't keep showing the planes from the old one.
      setNearby({ status: 'waiting', planes: [] })

      function load() {
        // Don't ask while the tab is hidden. Nobody is looking at it.
        if (document.hidden) {
          return
        }

        // Planes saved a moment ago (by a reload or another tab)? Use those.
        const saved = loadSavedPlanes(latitude, longitude, radiusMiles, SAVED_PLANES_SECONDS)

        if (saved) {
          setNearby({ status: 'ready', planes: saved })
          return
        }

        fetchNearbyPlanes(latitude, longitude, radiusMiles)
          .then(function (planes) {
            savePlanes(latitude, longitude, radiusMiles, planes)

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

      // Coming back to the tab? Get fresh planes straight away.
      document.addEventListener('visibilitychange', load)

      return function () {
        isCurrent = false
        clearInterval(interval)
        document.removeEventListener('visibilitychange', load)
      }
    },
    [latitude, longitude, radiusMiles],
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

  function handlePick(place) {
    setPicked(place)
    saveData(storageKey, place)
    setIsPicking(false)
  }

  function handleOpenPicker() {
    setIsPicking(true)
  }

  function handleClosePicker() {
    setIsPicking(false)
  }

  // Only offer to change the place when it's the picked one being used.
  let changePlace = null
  if (isUsingPicked) {
    changePlace = handleOpenPicker
  }

  if (!isFeedSetUp()) {
    return <FlightMessage text={flightText.notSetUp} />
  }

  if (isPicking) {
    // Cancel only makes sense if there's already a place to go back to.
    if (picked === null) {
      return <PlacePicker onPick={handlePick} onCancel={null} />
    } else {
      return <PlacePicker onPick={handlePick} onCancel={handleClosePicker} />
    }
  }

  if (here.status === 'waiting') {
    return <FlightMessage text={flightText.findingYou} />
  }

  if (here.status === 'failed' && picked === null) {
    return (
      <FlightMessage text={flightText.locationFailed} buttonText={flightText.pickPlace} onButton={handleOpenPicker} />
    )
  }

  if (nearby.status === 'waiting') {
    return <FlightMessage text={flightText.loading} />
  }

  if (nearby.status === 'failed') {
    return <FlightMessage text={flightText.loadFailed} buttonText={flightText.changePlace} onButton={changePlace} />
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
      return <FlightMessage text={flightText.noFlights} buttonText={flightText.changePlace} onButton={changePlace} />
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

  // The picked place's name shows on the pass, so you know where it's looking.
  let placeName = null
  if (isUsingPicked) {
    placeName = picked.name
  }

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
      placeName={placeName}
      onChangePlace={changePlace}
    />
  )
}

export default Flight
