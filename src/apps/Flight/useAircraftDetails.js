// useAircraftDetails: a plane's type and registration, like "Boeing 737NG 8AS/W · EI-EFZ".
// Uses what the feed sent if it has them, and looks them up on adsbdb if not.
import { useState, useEffect } from 'react'
import { fetchAircraft } from './flightApi.js'

// Planes already looked up, by id, so each is only asked for once.
const foundAircraft = {}

export function useAircraftDetails(plane) {
  const hasModel = plane.model !== ''

  // Kept with its id, so a new plane doesn't show the last one's details.
  const [found, setFound] = useState({ id: '', aircraft: null })

  useEffect(
    function () {
      if (hasModel) {
        return
      }

      const id = plane.id
      let isCurrent = true

      function show(aircraft) {
        if (isCurrent) {
          setFound({ id: id, aircraft: aircraft })
        }
      }

      if (id in foundAircraft) {
        show(foundAircraft[id])
      } else {
        fetchAircraft(id)
          .then(function (aircraft) {
            foundAircraft[id] = aircraft
            show(aircraft)
          })
          .catch(function () {
            // Leave it blank. It will try again next time this plane is shown.
          })
      }

      return function () {
        isCurrent = false
      }
    },
    [plane.id, hasModel],
  )

  let model = plane.model
  let registration = plane.registration
  if (!hasModel && found.id === plane.id && found.aircraft) {
    model = found.aircraft.model
    registration = found.aircraft.registration
  }

  if (model && registration) {
    return model + ' · ' + registration
  } else if (model) {
    return model
  } else {
    return ''
  }
}
