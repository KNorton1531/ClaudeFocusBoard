// Night city from a bedroom: city skyline through a window, with flickering window lights,
// passing car lights and slow clouds.
// To use the real art: put the image in this folder and set it as the background-image in NightCity.css.
import '../Background.css'
import './NightCity.css'

// Where the flickering lights sit, as [left %, bottom %].
const LIGHT_SPOTS = [
  [12, 22], [15, 30], [24, 18], [33, 35], [36, 26], [47, 20],
  [52, 40], [58, 28], [66, 22], [71, 33], [80, 25], [87, 19],
]

function NightCity() {
  const lights = LIGHT_SPOTS.map(function (spot, index) {
    return (
      <div
        key={index}
        className="city-light"
        style={{ left: spot[0] + '%', bottom: spot[1] + '%', animationDelay: index * 2.3 + 's' }}
      />
    )
  })

  return (
    <div className="background night-city">
      <div className="background-image" />
      <div className="scene">
        <div className="stars" />
        <div className="cloud" style={{ top: '10%', animationDuration: '140s', opacity: 0.4 }} />
        <div className="skyline" />
        {lights}
        <div className="car-light" />
        <div className="window-frame" />
      </div>
    </div>
  )
}

export default NightCity
