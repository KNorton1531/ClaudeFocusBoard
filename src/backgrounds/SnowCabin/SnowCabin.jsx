// Cabin in the snow: a cabin with a glowing window, chimney smoke and slow clouds.
// To use the real art: put the image in this folder and set it as the background-image in SnowCabin.css.
import '../Background.css'
import './SnowCabin.css'

const SMOKE_PUFFS = 4

function SnowCabin() {
  const smoke = []
  for (let i = 0; i < SMOKE_PUFFS; i = i + 1) {
    smoke.push(<div key={i} className="smoke" style={{ animationDelay: i * 1.5 + 's' }} />)
  }

  return (
    <div className="background snow-cabin">
      <div className="background-image" />
      <div className="scene">
        <div className="cloud" style={{ top: '12%', animationDuration: '160s' }} />
        <div className="cloud" style={{ top: '25%', animationDuration: '200s', animationDelay: '-90s' }} />
        <div className="snow-ground" />
        <div className="cabin">
          <div className="cabin-roof" />
          <div className="cabin-chimney">{smoke}</div>
          <div className="cabin-window" />
        </div>
      </div>
    </div>
  )
}

export default SnowCabin
