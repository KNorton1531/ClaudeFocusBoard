// Cabin in the snow: a small cabin in a quiet winter valley.
// The cabin is drawn from simple boxes so it can be swapped for real art later.
// To use the real art: put the image in this folder and set it as the
// background-image in SnowCabin.css.
import '../Background.css'
import './SnowCabin.css'

const SMOKE_PUFFS = 5
const STAR_COUNT = 26

function SnowCabin() {
  const smoke = []
  for (let i = 0; i < SMOKE_PUFFS; i = i + 1) {
    smoke.push(<span key={i} className="smoke" style={{ animationDelay: i * 1.4 + 's' }} />)
  }

  const stars = []
  for (let i = 0; i < STAR_COUNT; i = i + 1) {
    const style = {
      left: ((i * 43) % 100) + '%',
      top: ((i * 29) % 34) + '%',
      animationDelay: -((i * 17) % 60) / 10 + 's',
    }

    stars.push(<span key={i} className="frost-star" style={style} />)
  }

  return (
    <div className="background snow-cabin">
      <div className="background-image" />
      <div className="scene">
        {stars}
        <div className="cloud" style={{ top: '14%', animationDuration: '190s', opacity: 0.45 }} />
        <div className="cloud" style={{ top: '26%', animationDuration: '240s', animationDelay: '-110s', opacity: 0.3 }} />
        <div className="mountains" />
        <div className="haze valley-haze" />
        <div className="pines" />
        <div className="snow-ground" />

        <div className="cabin">
          <div className="cabin-body" />
          <div className="cabin-roof" />
          <div className="cabin-chimney">{smoke}</div>
          <div className="cabin-window" />
          <div className="cabin-door" />
          <div className="cabin-glow" />
        </div>
      </div>
      <div className="background-vignette" />
    </div>
  )
}

export default SnowCabin
