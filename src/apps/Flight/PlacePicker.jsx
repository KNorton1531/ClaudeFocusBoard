// PlacePicker: search for a place to watch planes over, for when the
// browser can't tell us where you are. Pick one and it's used instead.
// Uses the Weather App's place search (Open-Meteo, free, no key).
import { useState } from 'react'
import { flightText } from '../../content/flight.js'
import { searchPlaces } from '../Weather/weatherApi.js'

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

function PlacePicker({ onPick, onCancel }) {
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
    resultsArea = <p className="flight-message">{flightText.searching}</p>
  } else if (search.status === 'failed') {
    resultsArea = <p className="flight-message">{flightText.searchFailed}</p>
  } else if (search.status === 'done' && search.results.length === 0) {
    resultsArea = <p className="flight-message">{flightText.noResults}</p>
  } else if (search.status === 'done') {
    const rows = search.results.map(function (place) {
      return (
        <li key={place.id}>
          <button
            className="flight-result"
            onClick={function () {
              onPick(place)
            }}
          >
            {fullName(place)}
          </button>
        </li>
      )
    })

    resultsArea = <ul className="flight-results">{rows}</ul>
  } else {
    resultsArea = null
  }

  // Cancel only shows when there's somewhere to go back to.
  let cancelButton = null
  if (onCancel) {
    cancelButton = (
      <button className="flight-pill" onClick={onCancel}>
        {flightText.cancel}
      </button>
    )
  }

  return (
    <div className="flight-picker">
      {/* Kept to the left, so the frame's hover buttons (top right) never cover it. */}
      <div className="flight-picker-top">
        {cancelButton}
        <span className="flight-picker-title">{flightText.pickerTitle}</span>
      </div>

      <form className="flight-search" onSubmit={handleSearch}>
        <input
          className="flight-search-input"
          type="text"
          value={query}
          placeholder={flightText.searchPlaceholder}
          onChange={function (event) {
            setQuery(event.target.value)
          }}
        />
        <button className="flight-pill" type="submit">
          {flightText.searchButton}
        </button>
      </form>

      {resultsArea}
    </div>
  )
}

export default PlacePicker
