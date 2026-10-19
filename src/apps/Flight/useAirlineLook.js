// useAirlineLook: an airline's logo and main colour, as { logo, colour }.
// null until it's loaded, and stays null if there's no logo for the airline.
import { useState, useEffect } from 'react'
import { findAirlineLook } from './airlineLook.js'

export function useAirlineLook(code) {
  // Kept with its code, so a new airline doesn't show the last one's logo.
  const [found, setFound] = useState({ code: '', look: null })

  useEffect(
    function () {
      let isCurrent = true

      findAirlineLook(code).then(function (look) {
        if (isCurrent) {
          setFound({ code: code, look: look })
        }
      })

      return function () {
        isCurrent = false
      }
    },
    [code],
  )

  if (found.code === code) {
    return found.look
  } else {
    return null
  }
}
