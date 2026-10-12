// Glow: a soft light that gently brightens and dims, like a lamp or a lit window.
// Config: { type: 'glow', left: %, top: %, width: %, height: %, color: 'rgba(...)', seconds: 9 }
// left and top are the middle of the glow.
// Add "flicker: true" for an uneven flicker, like a candle or a fire.
function Glow({ layer }) {
  let className = 'layer-glow'
  if (layer.flicker) {
    className = 'layer-glow layer-glow-flicker'
  }

  const style = {
    left: layer.left + '%',
    top: layer.top + '%',
    width: layer.width + '%',
    height: layer.height + '%',
    background: 'radial-gradient(ellipse, ' + layer.color + ' 0%, transparent 70%)',
    animationDuration: layer.seconds + 's',
  }

  return <span className={className} style={style} />
}

export default Glow
