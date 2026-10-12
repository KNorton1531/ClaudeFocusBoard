// PlacesPanel: search for places to add, and remove saved ones.
// Shown inside the Weather App when you press the + button.
import { useState } from 'react'
import { weatherText } from '../../content/weather.js'
import { searchPlaces } from './weatherApi.js'

// "Leeds, England, United Kingdom", skipping any part that's missing.
function fullName(place) {
  const parts = [place.name]

  if (place.area) {
    parts.push(place.area)
  }

  if (place.country) {
    parts.push(place.country)
  }

  return parts.join(', ')
}

function PlacesPanel({ places, onAdd, onRemove, onDone }) {
  const [query, setQuery] = useState('')

  // status is 'idle', 'searching', 'done' or 'failed'.
  const [search, setSearch] = useState({ status: 'idle', results: [] })

  async function handleSearch(event) {
    // Stops the form reloading the page.
    event.preventDefault()

    const name = query.trim()
    if (name.length < 2) {
      return
    }

    setSearch({ status: 'searching', results: [] })

    try {
      const results = await searchPlaces(name)
      setSearch({ status: 'done', results: results })
    } catch {
      setSearch({ status: 'failed', results: [] })
    }
  }

  let resultsArea = null
  if (search.status === 'searching') {
    resultsArea = <p className="weather-message">{weatherText.searching}</p>
  } else if (search.status === 'failed') {
    resultsArea = <p className="weather-message">{weatherText.searchFailed}</p>
  } else if (search.status === 'done' && search.results.length === 0) {
    resultsArea = <p className="weather-message">{weatherText.noResults}</p>
  } else if (search.status === 'done') {
    const rows = search.results.map(function (place) {
      return (
        <li key={place.id}>
          <button
            className="weather-list-row weather-result"
            onClick={function () {
              onAdd(place)
            }}
          >
            <span>{fullName(place)}</span>
            <span className="weather-list-action">+</span>
          </button>
        </li>
      )
    })

    resultsArea = <ul className="weather-list">{rows}</ul>
  } else {
    resultsArea = null
  }

  let savedArea = null
  if (places.length === 0) {
    savedArea = <p className="weather-message">{weatherText.noSaved}</p>
  } else {
    const rows = places.map(function (place) {
      return (
        <li key={place.id} className="weather-list-row">
          <span>{fullName(place)}</span>
          <button
            className="weather-list-action weather-remove"
            title="Remove"
            onClick={function () {
              onRemove(place.id)
            }}
          >
            ✕
          </button>
        </li>
      )
    })

    savedArea = <ul className="weather-list">{rows}</ul>
  }

  return (
    <div className="weather-places">
      {/* Done goes on the left, so the frame's hover buttons (top right) never cover it. */}
      <div className="weather-places-top">
        <button className="weather-pill" onClick={onDone}>
          {weatherText.done}
        </button>
        <span className="weather-places-title">{weatherText.placesTitle}</span>
      </div>

      <form className="weather-search" onSubmit={handleSearch}>
        <input
          className="weather-search-input"
          type="text"
          value={query}
          placeholder={weatherText.searchPlaceholder}
          onChange={function (event) {
            setQuery(event.target.value)
          }}
        />
        <button className="weather-pill" type="submit">
          {weatherText.searchButton}
        </button>
      </form>

      {resultsArea}

      <div className="weather-places-title">{weatherText.savedTitle}</div>
      {savedArea}
    </div>
  )
}

export default PlacesPanel
