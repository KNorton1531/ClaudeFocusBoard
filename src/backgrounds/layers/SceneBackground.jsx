// SceneBackground: draws any background made from a picture plus scene layers.
// The background's own background.config.js says which picture to use and
// which layers (stars, clouds, glow, smoke) go where. No new code needed.
//
// The picture keeps its 16:9 shape. "framing" says whether it fills the screen
// or shows it all, and where it sits (see ../framing.js). Layers are placed
// inside it with %, so they stay on the same spot in the picture whatever
// shape the screen is.
import SceneLayer from './SceneLayer.jsx'
import { framingClassName, framingStyle } from '../framing.js'
import '../Background.css'
import '../framing.css'
import './layers.css'

function SceneBackground({ background, framing }) {
  const imageUrl = 'url(' + background.image + ')'

  const layers = background.layers.map(function (layer, index) {
    return <SceneLayer key={index} layer={layer} />
  })

  // When the whole picture is shown, a blurred copy fills the gaps around it.
  let backdrop = null
  if (framing.fit === 'fit') {
    backdrop = <div className="framed-backdrop" style={{ backgroundImage: imageUrl }} />
  }

  return (
    <div className="background" style={framingStyle(framing)}>
      {backdrop}
      <div className={'scene-picture ' + framingClassName(framing)} style={{ backgroundImage: imageUrl }}>
        {layers}
      </div>
      <div className="background-vignette" />
    </div>
  )
}

export default SceneBackground
