// SunTimes: when the sun rises and sets on one day, e.g. "↑07:32 ↓18:05".
// Used in the days-ahead list and for today.
import { sunIcons, weatherText } from '../../content/weather.js'

// Far north or south, some days have no sunrise or sunset at all.
function showTime(time) {
  if (time) {
    return time
  } else {
    return weatherText.noSunTime
  }
}

function SunTimes({ day }) {
  return (
    <span className="weather-sun">
      <span className="weather-sun-time" title={weatherText.sunrise}>
        <span className="weather-sun-icon">{sunIcons.sunrise}</span>
        {showTime(day.sunrise)}
      </span>
      <span className="weather-sun-time" title={weatherText.sunset}>
        <span className="weather-sun-icon">{sunIcons.sunset}</span>
        {showTime(day.sunset)}
      </span>
    </span>
  )
}

export default SunTimes
