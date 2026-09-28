// Autumn forest: warm golden forest with drifting clouds, light rays and falling leaves.
// To use the real art: put the image in this folder and set it as the background-image in AutumnForest.css.
import '../Background.css'
import './AutumnForest.css'

const LEAF_COUNT = 10

function AutumnForest() {
  const leaves = []
  for (let i = 0; i < LEAF_COUNT; i = i + 1) {
    leaves.push(<div key={i} className="leaf" style={{ left: i * 10 + 3 + '%', animationDelay: i * 1.7 + 's' }} />)
  }

  return (
    <div className="background autumn-forest">
      <div className="background-image" />
      <div className="scene">
        <div className="cloud" style={{ top: '8%', animationDuration: '90s' }} />
        <div className="cloud" style={{ top: '18%', animationDuration: '120s', animationDelay: '-40s' }} />
        <div className="light-rays" />
        <div className="trees" />
        {leaves}
      </div>
    </div>
  )
}

export default AutumnForest
