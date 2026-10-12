// Night city from a bedroom: the skyline seen through a bedroom window.
// The window frame sits nearest to you, the skyline is far away.
// To use the real art: put the image in this folder and set it as the
// background-image in NightCity.css.
import '../Background.css'
import './NightCity.css'

// Where the flickering windows sit, as [left %, bottom %].
const LIGHT_SPOTS = [
  [13, 20], [16, 29], [25, 17], [27, 24], [34, 33], [37, 25],
  [46, 19], [49, 30], [53, 38], [58, 27], [61, 21], [67, 34],
  [71, 23], [76, 31], [81, 18], [86, 27],
]

const STAR_COUNT = 40

function NightCity() {
  const lights = LIGHT_SPOTS.map(function (spot, index) {
    const style = {
      left: spot[0] + '%',
      bottom: spot[1] + '%',
      animationDelay: index * 1.7 + 's',
      animationDuration: 9 + (index % 7) * 2 + 's',
    }

    return <span key={index} className="city-light" style={style} />
  })

  const stars = []
  for (let i = 0; i < STAR_COUNT; i = i + 1) {
    const style = {
      left: ((i * 47) % 100) + '%',
      top: ((i * 31) % 45) + '%',
      animationDelay: -((i * 13) % 50) / 10 + 's',
      opacity: 0.3 + ((i * 3) % 7) / 10,
    }

    stars.push(<span key={i} className="star" style={style} />)
  }

  return (
    <div className="background night-city">
      <div className="background-image" />
      <div className="scene">
        {stars}
        <div className="moon" />
        <div className="cloud" style={{ top: '12%', animationDuration: '170s', opacity: 0.3 }} />
        <div className="skyline-far" />
        <div className="haze city-glow" />
        <div className="skyline-near" />
        {lights}
        <div className="car-light" />
        <div className="car-light car-light-slow" />
      </div>
      <div className="window-frame" />
      <div className="background-vignette" />
    </div>
  )
}

export default NightCity
