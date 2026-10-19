// WeatherWide: the "Wide" layout, set out like Google's weather card.
// Big icon and temperature on the left, rain/humidity/wind in the middle,
// the day and description on the right, then the days ahead in a row.
import { weatherText } from '../../content/weather.js'
import { describeWeather } from './weatherApi.js'
import WeatherDay from './WeatherDay.jsx'
import SunTimes from './SunTimes.jsx'

function WeatherWide({ forecast, days }) {
  const now = describeWeather(forecast.code, forecast.isDay)
  const today = forecast.days[0]
  const todayName = new Date(today.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long' })

  // days[0] is today, so the days ahead start from 1.
  const upcoming = forecast.days.slice(1, 1 + days)

  let dayList = null
  if (upcoming.length > 0) {
    const columns = upcoming.map(function (day) {
      return <WeatherDay key={day.date} day={day} />
    })

    dayList = <ul className="weather-days weather-days-wide">{columns}</ul>
  }

  return (
    <div className="weather-wide">
      <div className="weather-wide-top">
        <div className="weather-main">
          <span className="weather-icon">{now.icon}</span>
          <span className="weather-temperature">{forecast.temperature}°</span>
        </div>

        <div className="weather-wide-stats">
          <div>
            {weatherText.rain}: {today.rainChance}%
          </div>
          <div>
            {weatherText.humidity}: {forecast.humidity}%
          </div>
          <div>
            {weatherText.wind}: {forecast.windMph} mph
          </div>
        </div>

        <div className="weather-wide-summary">
          <div className="weather-wide-day">{todayName}</div>
          <div className="weather-description">{now.name}</div>
          <div className="weather-details">
            {weatherText.feelsLike} {forecast.feelsLike}° · H {today.high}° L {today.low}°
          </div>
          <div className="weather-details">
            <SunTimes day={today} />
          </div>
        </div>
      </div>
      {dayList}
    </div>
  )
}

export default WeatherWide
