// Clouds: soft blurry wisps drifting slowly sideways.
// Config: { type: 'clouds', color: 'rgba(...)', clouds: [{ top: %, height: %, seconds: 45 }, ...] }
// Add "fromLeft: true" to a cloud to send it the other way.
function Clouds({ layer }) {
  const clouds = layer.clouds.map(function (cloud, index) {
    let className = 'layer-cloud'
    if (cloud.fromLeft) {
      className = 'layer-cloud layer-cloud-from-left'
    }

    const style = {
      top: cloud.top + '%',
      height: cloud.height + '%',
      background: layer.color,
      animationDuration: cloud.seconds + 's',
      // Start each cloud part way across, so they're not all bunched up at the start.
      animationDelay: -((index * cloud.seconds) / layer.clouds.length) + 's',
    }

    return <span key={index} className={className} style={style} />
  })

  return <>{clouds}</>
}

export default Clouds
