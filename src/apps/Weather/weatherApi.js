// weatherApi.js: everything that talks to the outside world for the Weather App.
// Uses Open-Meteo (https://open-meteo.com). It is free and needs no API key.
import { weatherCodes, unknownWeather } from '../../content/weather.js'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// Open-Meteo sends times like "2026-10-19T07:32". It uses today's clock
// offset (e.g. BST, +1 hour) for every day, so days after the clocks change
// come out an hour wrong. To fix it, we turn the time back into a real moment
// (by taking the offset away), then show it in the place's own time zone,
// which knows when the clocks change. Gives back just the "07:32" part.
function timeOfDay(dateAndTime, offsetSeconds, timeZone) {
  if (!dateAndTime) {
    return ''
  }

  // Adding "Z" reads the time as if it were UTC.
  const asIfUtc = new Date(dateAndTime + 'Z').getTime()
  const realMoment = new Date(asIfUtc - offsetSeconds * 1000)

  return realMoment.toLocaleTimeString('en-GB', {
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
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
      sunrise: timeOfDay(raw.daily.sunrise[index], raw.utc_offset_seconds, raw.timezone),
      sunset: timeOfDay(raw.daily.sunset[index], raw.utc_offset_seconds, raw.timezone),
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

