// Autumn forest: a warm golden wood, seen from the path.
// Built from layers that get nearer as you go down the list, which is what
// gives the flat CSS scene a feeling of depth.
// To use the real art: put the image in this folder and set it as the
// background-image in AutumnForest.css.
import '../Background.css'
import './AutumnForest.css'

const LEAF_COUNT = 14

function AutumnForest() {
  const leaves = []

  for (let i = 0; i < LEAF_COUNT; i = i + 1) {
    // Spread the leaves out and start them at different times and speeds.
    const style = {
      left: ((i * 29) % 100) + '%',
      animationDelay: -((i * 23) % 160) / 10 + 's',
      animationDuration: 14 + ((i * 7) % 10) + 's',
      // Different sizes, so some leaves look nearer than others.
      width: 7 + ((i * 3) % 7) + 'px',
      height: 7 + ((i * 3) % 7) + 'px',
    }

    leaves.push(<span key={i} className="leaf" style={style} />)
  }

  return (
    <div className="background autumn-forest">
      <div className="background-image" />
      <div className="scene">
        <div className="sun" />
        <div className="cloud" style={{ top: '9%', animationDuration: '110s' }} />
        <div className="cloud" style={{ top: '19%', animationDuration: '150s', animationDelay: '-60s' }} />
        <div className="trees-far" />
        <div className="haze forest-haze" />
        <div className="trees-near" />
        <div className="light-rays" />
        <div className="forest-floor" />
        {leaves}
      </div>
      <div className="background-vignette" />
    </div>
  )
}

export default AutumnForest
