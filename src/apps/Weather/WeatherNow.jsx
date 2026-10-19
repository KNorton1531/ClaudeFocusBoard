// WeatherNow: the weather right now for one place, today's sunrise and sunset, and the days ahead.
import { weatherText } from '../../content/weather.js'
import { describeWeather } from './weatherApi.js'
import WeatherDay from './WeatherDay.jsx'
import SunTimes from './SunTimes.jsx'

function WeatherNow({ forecast, days }) {
  const now = describeWeather(forecast.code, forecast.isDay)
  const today = forecast.days[0]

  // days[0] is today, so the days ahead start from 1.
  const upcoming = forecast.days.slice(1, 1 + days)

  let dayList = null
  if (upcoming.length > 0) {
    const rows = upcoming.map(function (day) {
      return <WeatherDay key={day.date} day={day} />
    })

    dayList = <ul className="weather-days">{rows}</ul>
  }

  return (
    <div className="weather-now">
      <div className="weather-main">
        <span className="weather-icon">{now.icon}</span>
        <span className="weather-temperature">{forecast.temperature}°</span>
      </div>
      <div className="weather-description">{now.name}</div>
      <div className="weather-details">
        {weatherText.feelsLike} {forecast.feelsLike}° · H {today.high}° L {today.low}°
      </div>
      <div className="weather-details">
        <SunTimes day={today} />
      </div>
      {dayList}
    </div>
  )
}

export default WeatherNow
