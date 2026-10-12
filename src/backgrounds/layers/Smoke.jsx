// Smoke: puffs that rise, grow and fade, like a chimney or a cup of tea.
// Config: { type: 'smoke', left: %, top: %, size: 1.2, color: 'rgba(...)', puffs: 5, seconds: 7 }
// left and top are where the smoke comes out. size is how big a puff starts,
// as a % of the picture's width, so it scales with the screen.
function Smoke({ layer }) {
  const puffs = []

  for (let i = 0; i < layer.puffs; i = i + 1) {
    const style = {
      left: layer.left + '%',
      top: layer.top + '%',
      width: layer.size + 'cqw',
      height: layer.size + 'cqw',
      background: layer.color,
      animationDuration: layer.seconds + 's',
      // Spread the puffs out evenly, so there's always some smoke.
      animationDelay: -((i * layer.seconds) / layer.puffs) + 's',
    }

    puffs.push(<span key={i} className="layer-smoke" style={style} />)
  }

  return <>{puffs}</>
}

export default Smoke
