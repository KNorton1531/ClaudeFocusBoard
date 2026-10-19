// savedPlanes.js: keeps the last planes the feed sent, with when they came.
// Reloading the page, coming back to the tab, or a second tab can then use
// them instead of asking the feed again. Every ask keeps the feed (on Deno
// Deploy) awake, and its free plan only allows so much awake time.
import { loadData, saveData } from '../../storage/storage.js'

const STORAGE_KEY = 'flight-planes'

// Gives back the saved planes if they're for this spot and radius and younger
// than maxAgeSeconds. Otherwise gives back null.
export function loadSavedPlanes(latitude, longitude, radiusMiles, maxAgeSeconds) {
  const saved = loadData(STORAGE_KEY)

  if (!saved) {
    return null
  }

  // Locations wobble a little, so two decimal places (about 1 km) counts as the same spot.
  const sameSpot = saved.latitude.toFixed(2) === latitude.toFixed(2) && saved.longitude.toFixed(2) === longitude.toFixed(2)

  if (!sameSpot) {
    return null
  }

  if (saved.radiusMiles !== radiusMiles) {
    return null
  }

  const ageSeconds = (Date.now() - saved.time) / 1000

  if (ageSeconds > maxAgeSeconds) {
    return null
  }

  return saved.planes
}

export function savePlanes(latitude, longitude, radiusMiles, planes) {
  saveData(STORAGE_KEY, {
    time: Date.now(),
    latitude: latitude,
    longitude: longitude,
    radiusMiles: radiusMiles,
    planes: planes,
  })
}
