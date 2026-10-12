// Weather: the weather for one place at a time, with arrows to flick between places.
// "My location" comes from the browser. Other places are added with the search
// and saved under 'weather-<appId>', the same way Notes saves each note.
import { useState, useEffect } from 'react'
import { loadData, saveData } from '../../storage/storage.js'
import { weatherText } from '../../content/weather.js'
import { fetchForecast, getMyLocation } from './weatherApi.js'
import WeatherNow from './WeatherNow.jsx'
import WeatherWide from './WeatherWide.jsx'
import PlacesPanel from './PlacesPanel.jsx'
import './Weather.css'

const HERE_ID = 'here'
const REFRESH_MINUTES = 15

// Roughly how wide and tall the weather is, measured in "em" (one em is
// one line of text). Weather.css uses these to pick a text size that fits
// the card. If things get cut off, make these numbers a bit bigger.
function contentSize(layout, days) {
  if (layout === 'wide') {
    let lines = 9.5
    if (days > 0) {
      lines = lines + 5.5
    }

    return { width: 28, lines: lines }
  }

  let lines = 11
  if (days > 0) {
    lines = lines + 1 + days * 1.5
  }

  return { width: 14, lines: lines }
}

function Weather({ appId, settings }) {
  const storageKey = 'weather-' + appId

  // places: the places you added with the search. shownId: the one on screen.
  const [saved, setSaved] = useState(function () {
    const fromStorage = loadData(storageKey)

    if (fromStorage) {
      return fromStorage
    } else {
      return { places: [], shownId: HERE_ID }
    }
  })

  // Where "My location" is. status is 'waiting', 'ready' or 'failed'.
  const [here, setHere] = useState({ status: 'waiting' })

  // Every forecast fetched so far, by "latitude,longitude,units",
  // so flicking back to a place shows it straight away.
  const [forecasts, setForecasts] = useState({})

  // True while the Places panel (search and saved list) is open.
  const [isPicking, setIsPicking] = useState(false)

  function save(next) {
    setSaved(next)
    saveData(storageKey, next)
  }

  // Every place you can flick between, in order. My location goes first.
  let places = saved.places
  if (settings.useMyLocation) {
    places = [{ id: HERE_ID, name: weatherText.myLocation }, ...saved.places]
  }

  // Find the shown place. If it was removed, fall back to the first one.
  let shownIndex = 0
  for (let i = 0; i < places.length; i = i + 1) {
    if (places[i].id === saved.shownId) {
      shownIndex = i
    }
  }

  let shown = null
  if (places.length > 0) {
    shown = places[shownIndex]
  }

  // The spot to get the weather for. Stays null until we know it.
  let latitude = null
  let longitude = null
  if (shown === null) {
    latitude = null
  } else if (shown.id === HERE_ID) {
    if (here.status === 'ready') {
      latitude = here.latitude
      longitude = here.longitude
    }
  } else {
    latitude = shown.latitude
    longitude = shown.longitude
  }

  const forecastKey = latitude + ',' + longitude + ',' + settings.units

  // Ask the browser where we are, if My location is switched on.
  useEffect(
    function () {
      if (!settings.useMyLocation) {
        return
      }

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
    },
    [settings.useMyLocation],
  )

  // Get the weather for the shown place, then again every few minutes.
  useEffect(
    function () {
      if (latitude === null) {
        return
      }

      let isCurrent = true

      function load() {
        fetchForecast(latitude, longitude, settings.units)
          .then(function (data) {
            if (isCurrent) {
              setForecasts(function (current) {
                return { ...current, [forecastKey]: { status: 'ready', data: data } }
              })
            }
          })
          .catch(function () {
            if (!isCurrent) {
              return
            }

            setForecasts(function (current) {
              // If a refresh fails, keep showing the last good weather.
              if (current[forecastKey]) {
                return current
              } else {
                return { ...current, [forecastKey]: { status: 'failed' } }
              }
            })
          })
      }

      load()
      const interval = setInterval(load, REFRESH_MINUTES * 60 * 1000)

      return function () {
        isCurrent = false
        clearInterval(interval)
      }
    },
    [latitude, longitude, settings.units, forecastKey],
  )

  // Shows the place at this position in the list, wrapping round at the ends.
  function showPlace(index) {
    const wrapped = (index + places.length) % places.length
    save({ ...saved, shownId: places[wrapped].id })
  }

  // Move on to the next place on its own, if that's switched on in settings.
  // The timer starts again whenever the shown place changes.
  const switchSeconds = Number(settings.switchEvery)

  let nextPlaceId = null
  if (places.length > 1) {
    nextPlaceId = places[(shownIndex + 1) % places.length].id
  }

  useEffect(
    function () {
      if (switchSeconds === 0) {
        return
      }

      if (nextPlaceId === null) {
        return
      }

      // Don't switch while you're searching for a place.
      if (isPicking) {
        return
      }

      const timer = setTimeout(function () {
        const next = { ...saved, shownId: nextPlaceId }
        setSaved(next)
        saveData(storageKey, next)
      }, switchSeconds * 1000)

      return function () {
        clearTimeout(timer)
      }
    },
    [switchSeconds, nextPlaceId, isPicking, saved, storageKey],
  )

  function handleAdd(place) {
    // Already saved? Just show it.
    for (const savedPlace of saved.places) {
      if (savedPlace.id === place.id) {
        save({ ...saved, shownId: place.id })
        setIsPicking(false)
        return
      }
    }

    save({ places: [...saved.places, place], shownId: place.id })
    setIsPicking(false)
  }

  function handleRemove(id) {
    const remaining = saved.places.filter(function (place) {
      return place.id !== id
    })

    save({ ...saved, places: remaining })
  }

  function handleOpenPlaces() {
    setIsPicking(true)
  }

  function handleClosePlaces() {
    setIsPicking(false)
  }

  if (isPicking) {
    return (
      <PlacesPanel places={saved.places} onAdd={handleAdd} onRemove={handleRemove} onDone={handleClosePlaces} />
    )
  }

  if (shown === null) {
    return (
      <div className="weather weather-empty">
        <p className="weather-message">{weatherText.noPlaces}</p>
        <button className="weather-pill" onClick={handleOpenPlaces}>
          {weatherText.addPlace}
        </button>
      </div>
    )
  }

  // The main part: a message while waiting, or the weather itself.
  let body = null
  if (shown.id === HERE_ID && here.status === 'waiting') {
    body = <p className="weather-message">{weatherText.findingYou}</p>
  } else if (shown.id === HERE_ID && here.status === 'failed') {
    body = <p className="weather-message">{weatherText.locationFailed}</p>
  } else {
    const forecast = forecasts[forecastKey]

    if (!forecast) {
      body = <p className="weather-message">{weatherText.loading}</p>
    } else if (forecast.status === 'failed') {
      body = <p className="weather-message">{weatherText.loadFailed}</p>
    } else if (settings.layout === 'wide') {
      body = <WeatherWide forecast={forecast.data} days={Number(settings.days)} />
    } else {
      body = <WeatherNow forecast={forecast.data} days={Number(settings.days)} />
    }
  }

  // The arrows and dots only show when there's more than one place.
  let switcher = null

  if (places.length > 1) {
    const dotList = places.map(function (place, index) {
      let className = 'weather-dot'
      if (index === shownIndex) {
        className = 'weather-dot weather-dot-shown'
      }

      return (
        <button
          key={place.id}
          className={className}
          title={place.name}
          onClick={function () {
            showPlace(index)
          }}
        />
      )
    })

    switcher = (
      <div className="weather-switcher">
        <button
          className="weather-arrow"
          title="Previous place"
          onClick={function () {
            showPlace(shownIndex - 1)
          }}
        >
          ‹
        </button>
        {dotList}
        <button
          className="weather-arrow"
          title="Next place"
          onClick={function () {
            showPlace(shownIndex + 1)
          }}
        >
          ›
        </button>
      </div>
    )
  }

  // Tells the CSS how big the content is, so the text can grow to fill the card.
  const size = contentSize(settings.layout, Number(settings.days))
  const sizeStyle = { '--weather-width': size.width, '--weather-lines': size.lines }

  // + sits top left, out of the way of the frame's hover buttons (top right).
  return (
    <div className="weather" style={sizeStyle}>
      <div className="weather-top">
        <button className="weather-arrow weather-places-button" title={weatherText.placesTitle} onClick={handleOpenPlaces}>
          +
        </button>
        <div className="weather-place">{shown.name}</div>
      </div>
      <div className="weather-body">{body}</div>
      {switcher}
    </div>
  )
}

export default Weather
