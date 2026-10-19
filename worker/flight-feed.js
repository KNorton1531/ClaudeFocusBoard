// flight-feed.js: a tiny Deno Deploy app for the Flight App.
// It is not part of the website. It runs on Deno Deploy (free) and is set up by hand.
// See "Flight" in docs/04-apps.md for the steps.
//
// Why it's needed: the free live plane feeds don't let websites read them
// straight from the browser. This fetches the planes for us and adds the
// header that lets the Focus Board read them.
// (It used to be a Cloudflare Worker, but every feed blocks or limits Cloudflare.)
//
// Ask it:   https://<your-app>.deno.net/?lat=51.5&lon=-0.1&dist=30
// (dist is in nautical miles, from 1 to 250)
// It always answers in adsb.fi's layout: { aircraft: [...] }.
//
// Check it: https://<your-app>.deno.net/?check=1
// Tries every feed and says which ones work from here.
//
// OpenSky is a last resort, used only if its login is set in two environment
// variables: OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET.

// Only these sites may use it, so it can't be borrowed by anyone else.
const ALLOWED_SITES = ['https://knorton1531.github.io', 'http://localhost', 'http://127.0.0.1']

// Some feeds turn away requests that don't say who they are.
const USER_AGENT = 'FocusBoard flight-feed (https://github.com/KNorton1531/ClaudeFocusBoard)'

const OPENSKY_TOKEN_URL = 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token'
const OPENSKY_STATES_URL = 'https://opensky-network.org/api/states/all'

const FEET_PER_METRE = 3.28084
const KNOTS_PER_METRE_A_SECOND = 1.94384

// OpenSky numbers its plane sizes. These are the same sizes in adsb.fi's letters.
// 0 and 1 mean "not known", so they're left out.
const OPENSKY_SIZES = { 2: 'A1', 3: 'A2', 4: 'A3', 5: 'A4', 6: 'A5', 7: 'A6' }

// The spot used by ?check=1 (Heathrow, which always has planes).
const CHECK_SPOT = { lat: 51.47, lon: -0.45, dist: 25 }

// OpenSky's login token lasts 30 minutes, so it's kept and reused until then.
let openskyToken = ''
let openskyTokenEnds = 0

function isAllowed(origin) {
  if (!origin) {
    return false
  }

  for (const site of ALLOWED_SITES) {
    // "http://localhost:5173" is allowed by "http://localhost".
    if (origin === site || origin.startsWith(site + ':')) {
      return true
    }
  }

  return false
}

function reply(body, status, origin) {
  return new Response(body, {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
    },
  })
}

// How far apart two spots are in nautical miles, and which way the second one
// is from the first in degrees (0 is north, 90 is east).
function distanceAndDirection(fromLat, fromLon, toLat, toLon) {
  const toRadians = Math.PI / 180
  const earthRadiusNauticalMiles = 3440.1

  const lat1 = fromLat * toRadians
  const lat2 = toLat * toRadians
  const latChange = (toLat - fromLat) * toRadians
  const lonChange = (toLon - fromLon) * toRadians

  const a = Math.sin(latChange / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonChange / 2) ** 2
  const distance = 2 * earthRadiusNauticalMiles * Math.asin(Math.sqrt(a))

  const y = Math.sin(lonChange) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonChange)
  const direction = (Math.atan2(y, x) / toRadians + 360) % 360

  return { distance: distance, direction: direction }
}

// Gets a feed's answer as text. Throws with the feed's status if it fails.
async function fetchText(url, headers) {
  const response = await fetch(url, { headers: headers })

  if (!response.ok) {
    throw new Error(String(response.status))
  }

  return await response.text()
}

// Two decimal places is about 1 km, plenty for "planes near me".
function fromAdsbFi(lat, lon, dist) {
  const url =
    'https://opendata.adsb.fi/api/v2/lat/' + lat.toFixed(2) + '/lon/' + lon.toFixed(2) + '/dist/' + Math.round(dist)

  return fetchText(url, { 'User-Agent': USER_AGENT })
}

// adsb.lol calls its list "ac", so it's renamed to "aircraft" to match adsb.fi.
async function fromAdsbLol(lat, lon, dist) {
  const url = 'https://api.adsb.lol/v2/point/' + lat.toFixed(2) + '/' + lon.toFixed(2) + '/' + Math.round(dist)
  const raw = JSON.parse(await fetchText(url, { 'User-Agent': USER_AGENT }))

  return JSON.stringify({ aircraft: raw.ac })
}

async function getOpenskyToken() {
  // Still good for at least another minute? Use it again.
  if (openskyToken && Date.now() < openskyTokenEnds - 60 * 1000) {
    return openskyToken
  }

  const response = await fetch(OPENSKY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: Deno.env.get('OPENSKY_CLIENT_ID'),
      client_secret: Deno.env.get('OPENSKY_CLIENT_SECRET'),
    }),
  })

  if (!response.ok) {
    throw new Error('login ' + response.status)
  }

  const login = await response.json()
  openskyToken = login.access_token
  openskyTokenEnds = Date.now() + login.expires_in * 1000

  return openskyToken
}

// Gets the planes near a spot from OpenSky, laid out like adsb.fi's.
async function fromOpensky(lat, lon, dist) {
  if (!Deno.env.get('OPENSKY_CLIENT_ID') || !Deno.env.get('OPENSKY_CLIENT_SECRET')) {
    throw new Error('login not set')
  }

  const token = await getOpenskyToken()

  // OpenSky wants a box, not a circle. One degree of latitude is 60 nautical miles.
  // Degrees of longitude get narrower towards the poles, hence the cos().
  const latSize = dist / 60
  const lonSize = dist / (60 * Math.max(Math.cos((lat * Math.PI) / 180), 0.1))

  const params = new URLSearchParams({
    lamin: (lat - latSize).toFixed(3),
    lamax: (lat + latSize).toFixed(3),
    lomin: (lon - lonSize).toFixed(3),
    lomax: (lon + lonSize).toFixed(3),
    extended: '1',
  })

  const raw = JSON.parse(
    await fetchText(OPENSKY_STATES_URL + '?' + params, { Authorization: 'Bearer ' + token, 'User-Agent': USER_AGENT }),
  )

  // No planes means "states" is null, not an empty list.
  let states = []
  if (raw.states) {
    states = raw.states
  }

  const aircraft = []

  // Each plane is a list. See "State Vectors" in OpenSky's REST API docs for what's where.
  for (const state of states) {
    const planeLon = state[5]
    const planeLat = state[6]

    if (typeof planeLat === 'number' && typeof planeLon === 'number') {
      const away = distanceAndDirection(lat, lon, planeLat, planeLon)

      // The box has corners outside the circle, so skip planes in the corners.
      if (away.distance <= dist) {
        let altitude = 'ground'
        if (!state[8] && typeof state[7] === 'number') {
          altitude = Math.round(state[7] * FEET_PER_METRE)
        }

        let climbRate = 0
        if (typeof state[11] === 'number') {
          climbRate = Math.round(state[11] * FEET_PER_METRE * 60)
        }

        let speed = 0
        if (typeof state[9] === 'number') {
          speed = state[9] * KNOTS_PER_METRE_A_SECOND
        }

        aircraft.push({
          hex: state[0],
          flight: state[1],
          lat: planeLat,
          lon: planeLon,
          alt_baro: altitude,
          gs: speed,
          baro_rate: climbRate,
          category: OPENSKY_SIZES[state[17]],
          dst: away.distance,
          dir: away.direction,
        })
      }
    }
  }

  return JSON.stringify({ aircraft: aircraft })
}

// The feeds, tried in this order. adsb.fi has the best data and no daily limit.
const FEEDS = [
  { name: 'adsb.fi', get: fromAdsbFi },
  { name: 'adsb.lol', get: fromAdsbLol },
  { name: 'opensky', get: fromOpensky },
]

// ?check=1: tries every feed and says which work from here.
async function checkFeeds() {
  const results = {}

  for (const feed of FEEDS) {
    try {
      const body = await feed.get(CHECK_SPOT.lat, CHECK_SPOT.lon, CHECK_SPOT.dist)
      results[feed.name] = 'works (' + JSON.parse(body).aircraft.length + ' planes)'
    } catch (error) {
      results[feed.name] = 'failed: ' + error.message
    }
  }

  return JSON.stringify(results)
}

export async function handleRequest(request) {
  const origin = request.headers.get('Origin')
  const params = new URL(request.url).searchParams

  // The check only says which feeds work, so anyone may run it, from any browser tab.
  if (params.get('check')) {
    return reply(await checkFeeds(), 200, '*')
  }

  if (!isAllowed(origin)) {
    return new Response('Not allowed', { status: 403 })
  }

  const lat = Number(params.get('lat'))
  const lon = Number(params.get('lon'))
  const dist = Number(params.get('dist'))

  const badLat = !params.get('lat') || Number.isNaN(lat) || Math.abs(lat) > 90
  const badLon = !params.get('lon') || Number.isNaN(lon) || Math.abs(lon) > 180
  const badDist = Number.isNaN(dist) || dist < 1 || dist > 250

  if (badLat || badLon || badDist) {
    return reply('{"error":"Send lat, lon and dist"}', 400, origin)
  }

  // Try each feed in turn, and send back the first one that works.
  const problems = []

  for (const feed of FEEDS) {
    try {
      return reply(await feed.get(lat, lon, dist), 200, origin)
    } catch (error) {
      problems.push(feed.name + ' ' + error.message)
    }
  }

  // None worked. Say what each one answered, to help fix it.
  return reply(JSON.stringify({ error: 'Feed failed', problems: problems }), 502, origin)
}

Deno.serve(handleRequest)
