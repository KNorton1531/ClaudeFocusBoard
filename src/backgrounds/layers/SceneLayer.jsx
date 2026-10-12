// SceneLayer: draws one layer from a background.config.js.
// If the layer has an "area", it is drawn only inside that part of the
// picture (like a window) and cut off at the edges.
import Stars from './Stars.jsx'
import Clouds from './Clouds.jsx'
import Glow from './Glow.jsx'
import Smoke from './Smoke.jsx'

// Every layer type a config can use. To add a new kind of layer,
// make its component in this folder and add one line here.
const LAYER_TYPES = {
  stars: Stars,
  clouds: Clouds,
  glow: Glow,
  smoke: Smoke,
}

function SceneLayer({ layer }) {
  const LayerComponent = LAYER_TYPES[layer.type]

  // Unknown type (maybe a typo in the config): draw nothing rather than crash.
  if (!LayerComponent) {
    return null
  }

  // With no area, the layer covers the whole picture.
  let style = { left: '0%', top: '0%', width: '100%', height: '100%' }

  if (layer.area) {
    style = {
      left: layer.area.left + '%',
      top: layer.area.top + '%',
      width: layer.area.width + '%',
      height: layer.area.height + '%',
      borderRadius: layer.area.rounded + '%',
    }
  }

  return (
    <div className="scene-layer" style={style}>
      <LayerComponent layer={layer} />
    </div>
  )
}

export default SceneLayer
