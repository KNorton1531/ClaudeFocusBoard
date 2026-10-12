// Snow: slow drifting flakes that work on top of any background.
import '../Effects.css'
import './Snow.css'

const FLAKE_COUNT = 50

function Snow() {
  const flakes = []

  for (let i = 0; i < FLAKE_COUNT; i = i + 1) {
    // Mix the sizes and speeds so some flakes feel near and some far away.
    const size = 3 + ((i * 5) % 5)

    const style = {
      left: ((i * 41) % 100) + '%',
      width: size + 'px',
      height: size + 'px',
      animationDelay: -((i * 17) % 120) / 10 + 's',
      animationDuration: 9 + ((i * 11) % 9) + 's',
      opacity: 0.4 + ((i * 3) % 6) / 10,
    }

    flakes.push(<span key={i} className="snow-flake" style={style} />)
  }

  return <div className="effect snow">{flakes}</div>
}

export default Snow
