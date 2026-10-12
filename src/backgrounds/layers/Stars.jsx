// Stars: small dots that twinkle at different speeds.
// Config: { type: 'stars', spots: [[left %, top %], ...] }
function Stars({ layer }) {
  const stars = layer.spots.map(function (spot, index) {
    const style = {
      left: spot[0] + '%',
      top: spot[1] + '%',
      animationDelay: -((index * 13) % 50) / 10 + 's',
      animationDuration: 4 + (index % 4) + 's',
    }

    return <span key={index} className="layer-star" style={style} />
  })

  return <>{stars}</>
}

export default Stars
