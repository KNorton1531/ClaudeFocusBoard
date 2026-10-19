// WeatherDay: one row in the days-ahead list, e.g. "Tue 🌧️ 14° 8° ↑07:32 ↓18:05".
import { describeWeather } from './weatherApi.js'
import SunTimes from './SunTimes.jsx'

function WeatherDay({ day }) {
  const weather = describeWeather(day.code, true)

  // The date comes as "2026-10-13". Midday avoids time zone edge cases.
  const dayName = new Date(day.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' })

  return (
    <li className="weather-day">
      <span className="weather-day-name">{dayName}</span>
      <span className="weather-day-icon" title={weather.name}>
        {weather.icon}
      </span>
      <span className="weather-day-high">{day.high}°</span>
      <span className="weather-day-low">{day.low}°</span>
      <SunTimes day={day} />
    </li>
  )
}

export default WeatherDay
