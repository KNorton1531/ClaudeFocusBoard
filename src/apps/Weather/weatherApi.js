// weatherApi.js: everything that talks to the outside world for the Weather App.
// Uses Open-Meteo (https://open-meteo.com). It is free and needs no API key.
import { weatherCodes, unknownWeather } from '../../content/weather.js'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// Turns a weather code into its name and icon.
export function describeWeather(code, isDay) {
  let info = weatherCodes[code]

  if (!info) {
    info = unknownWeather
  }

  if (isDay) {
    return { name: info.name, icon: info.icon }
  } else {
    return { name: info.name, icon: info.nightIcon }
  }
}

// Gets the weather now plus the next week for one spot.
// units is 'celsius' or 'fahrenheit'.
// Gives back a tidy object, so the rest of the App doesn't need to know
// how Open-Meteo lays out its data.
export async function fetchForecast(latitude, longitude, units) {
  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    current: 'temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    temperature_unit: units,
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: 8,
  })

  const response = await fetch(FORECAST_URL + '?' + params)

  if (!response.ok) {
    throw new Error('Weather request failed')
  }

  const raw = await response.json()

  const days = raw.daily.time.map(function (date, index) {
    return {
      date: date,
      code: raw.daily.weather_code[index],
      high: Math.round(raw.daily.temperature_2m_max[index]),
      low: Math.round(raw.daily.temperature_2m_min[index]),
      // Chance of rain, from 0 to 100.
      rainChance: raw.daily.precipitation_probability_max[index],
    }
  })

  return {
    temperature: Math.round(raw.current.temperature_2m),
    feelsLike: Math.round(raw.current.apparent_temperature),
    code: raw.current.weather_code,
    isDay: raw.current.is_day === 1,
    humidity: raw.current.relative_humidity_2m,
    windMph: Math.round(raw.current.wind_speed_10m),
    // days[0] is today, the rest are the days after.
    days: days,
  }
}

// Looks up places by name, e.g. "Leeds". Gives back up to 6 matches.
export async function searchPlaces(name) {
  const params = new URLSearchParams({ name: name, count: 6, language: 'en', format: 'json' })
  const response = await fetch(SEARCH_URL + '?' + params)

  if (!response.ok) {
    throw new Error('Place search failed')
  }

  const raw = await response.json()

  // No matches means there is no "results" list at all.
  if (!raw.results) {
    return []
  }

  return raw.results.map(function (result) {
    // "area" is the county or state, to tell apart places with the same name.
    let area = ''
    if (result.admin1) {
      area = result.admin1
    }

    let country = ''
    if (result.country) {
      country = result.country
    }

    return {
      id: String(result.id),
      name: result.name,
      area: area,
      country: country,
      latitude: result.latitude,
      longitude: result.longitude,
    }
  })
}

// Asks the browser where we are. The browser shows a permission pop-up the first time.
export function getMyLocation() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      reject(new Error('This browser cannot share its location'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      function (error) {
        reject(error)
      },
      // Reuse a location up to 30 minutes old, and give up after 15 seconds.
      { maximumAge: 30 * 60 * 1000, timeout: 15000 },
    )
  })
}
