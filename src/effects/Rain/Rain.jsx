// Rain: falling drops that work on top of any background.
import '../Effects.css'
import './Rain.css'

const DROP_COUNT = 60

function Rain() {
  const drops = []

  for (let i = 0; i < DROP_COUNT; i = i + 1) {
    // Spread the drops across the screen and start them at different times,
    // so the rain does not fall in a single line.
    const style = {
      left: ((i * 37) % 100) + '%',
      animationDelay: ((i * 13) % 20) / 10 + 's',
      animationDuration: 0.6 + ((i * 7) % 8) / 10 + 's',
      opacity: 0.25 + ((i * 3) % 5) / 10,
    }

    drops.push(<span key={i} className="rain-drop" style={style} />)
  }

  return <div className="effect rain">{drops}</div>
}

export default Rain
