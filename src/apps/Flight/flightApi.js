// flightApi.js: everything that talks to the outside world for the Flight App.
// Live planes come from adsb.fi (or a backup feed), through our own small Deno Deploy app (worker/flight-feed.js).
// Routes (where a flight is from and going to) and plane types come from adsbdb.com (free, no API key).
import { notAirlines } from '../../content/flight.js'

// Paste the feed's address here once it's set up, e.g.
// 'https://flight-feed.your-name.deno.net'. See "Flight" in docs/04-apps.md.
const FEED_URL = 'https://sleek-pelican-5214.poisonportal.deno.net'

const ROUTE_URL = 'https://api.adsbdb.com/v0/callsign/'
const AIRCRAFT_URL = 'https://api.adsbdb.com/v0/aircraft/'

const MILES_PER_NAUTICAL_MILE = 1.15078
const MPH_PER_KNOT = 1.15078

// Plane sizes that airliners use. A2 is small (turboprops like the ATR),
// A3 is large (737, A320), A4 is a 757, A5 is heavy (777, A380).
const AIRLINER_SIZES = ['A2', 'A3', 'A4', 'A5']

export function isFeedSetUp() {
  return FEED_URL !== ''
}

// Airline callsigns are 3 letters then a number, like "BAW117" or "EZY45LP".
// Private planes use their registration instead, like "GBZIO".
function looksLikeAirliner(plane, callsign) {
  if (!/^[A-Z]{3}[0-9]/.test(callsign)) {
    return false
  }

  if (notAirlines.includes(callsign.slice(0, 3))) {
    return false
  }

  // OpenSky often doesn't know the size. Then the route lookup does the sorting.
  if (plane.category && !AIRLINER_SIZES.includes(plane.category)) {
    return false
  }

  // Planes on the ground send "ground" instead of a number.
  if (typeof plane.alt_baro !== 'number') {
    return false
  }

  if (typeof plane.lat !== 'number') {
    return false
  }

  // Slower than 60 knots means it's really still on the ground, even if
  // the feed sent an old altitude (OpenSky sometimes does).
  if (typeof plane.gs !== 'number' || plane.gs < 60) {
    return false
  }

  return true
}

// Gets the airliners flying within radiusMiles of a spot, nearest first.
// Gives back a tidy list, so the rest of the App doesn't need to know
// how the feed lays out its data.
export async function fetchNearbyPlanes(latitude, longitude, radiusMiles) {
  const params = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    dist: Math.round(radiusMiles / MILES_PER_NAUTICAL_MILE),
  })

  const response = await fetch(FEED_URL + '/?' + params)

  if (!response.ok) {
    throw new Error('Flight feed request failed')
  }

  const raw = await response.json()
  const planes = []

  for (const plane of raw.aircraft) {
    let callsign = ''
    if (plane.flight) {
      callsign = plane.flight.trim()
    }

    if (looksLikeAirliner(plane, callsign)) {
      // "desc" is a name like "BOEING 737 MAX 8". Fall back to the short code, like "B38M".
      let model = ''
      if (plane.desc) {
        model = plane.desc
      } else if (plane.t) {
        model = plane.t
      }

      let climbRate = 0
      if (typeof plane.baro_rate === 'number') {
        climbRate = plane.baro_rate
      }

      planes.push({
        id: plane.hex,
        callsign: callsign,
        model: model,
        registration: plane.r,
        latitude: plane.lat,
        longitude: plane.lon,
        // Altimeters can read a little below 0 when landing, so it never goes under 0.
        altitudeFeet: Math.max(plane.alt_baro, 0),
        speedMph: Math.round(plane.gs * MPH_PER_KNOT),
        // Feet per minute. Above 0 is climbing, below 0 is descending.
        climbRate: climbRate,
        // How far away it is, and which way to look (0 is north, 90 is east).
        awayMiles: plane.dst * MILES_PER_NAUTICAL_MILE,
        direction: plane.dir,
      })
    }
  }

  planes.sort(function (a, b) {
    return a.awayMiles - b.awayMiles
  })

  return planes
}

// Tidies up an airport from adsbdb.
function tidyAirport(airport) {
  return {
    code: airport.iata_code,
    city: airport.municipality,
    name: airport.name,
    latitude: airport.latitude,
    longitude: airport.longitude,
  }
}

// Looks up where a flight is from and going to, e.g. "BAW117" is London to New York.
// Gives back null if the callsign isn't known.
export async function fetchRoute(callsign) {
  const response = await fetch(ROUTE_URL + callsign)

  // adsbdb answers 404 for a callsign it doesn't know.
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Route request failed')
  }

  const raw = await response.json()

  if (!raw.response.flightroute) {
    return null
  }

  const route = raw.response.flightroute

  // "BA117" reads nicer than "BAW117". Some airlines don't have the short one.
  let flightNumber = route.callsign_icao
  if (route.callsign_iata && route.airline && route.airline.iata) {
    flightNumber = route.callsign_iata
  }

  let airline = ''
  if (route.airline) {
    airline = route.airline.name
  }

  return {
    flightNumber: flightNumber,
    airline: airline,
    from: tidyAirport(route.origin),
    to: tidyAirport(route.destination),
  }
}

// Looks up a plane's type and registration by its id (hex), e.g. "Airbus A320-214" and "G-KKAZ".
// Needed when the feed doesn't send them (OpenSky doesn't). Gives back null if it isn't known.
export async function fetchAircraft(id) {
  const response = await fetch(AIRCRAFT_URL + id)

  // adsbdb answers 404 for a plane it doesn't know.
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Aircraft request failed')
  }

  const raw = await response.json()

  if (!raw.response.aircraft) {
    return null
  }

  const aircraft = raw.response.aircraft

  // Just the first word of the maker: "Airbus", not "Airbus Sas".
  const maker = aircraft.manufacturer.split(' ')[0]

  return {
    model: maker + ' ' + aircraft.type,
    registration: aircraft.registration,
  }
}

// Distance in miles between two spots on the globe (the "haversine" formula).
export function milesBetween(latitude1, longitude1, latitude2, longitude2) {
  const toRadians = Math.PI / 180
  const earthRadiusMiles = 3959

  const latitudeChange = (latitude2 - latitude1) * toRadians
  const longitudeChange = (longitude2 - longitude1) * toRadians

  const a =
    Math.sin(latitudeChange / 2) ** 2 +
    Math.cos(latitude1 * toRadians) * Math.cos(latitude2 * toRadians) * Math.sin(longitudeChange / 2) ** 2

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a))
}
