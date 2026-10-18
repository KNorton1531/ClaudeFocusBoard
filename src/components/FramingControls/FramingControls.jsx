// FramingControls: the "Fit to screen" part of the Background settings menu.
// Picks fill or fit, and slides the background left/right and up/down.
// What a framing is: see backgrounds/framing.js.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { DEFAULT_FRAMING } from '../../backgrounds/framing.js'
import { fitOptions, framingText } from '../../content/background-framing.js'
import './FramingControls.css'

function FramingControls({ name, framing, onChange }) {
  function handlePickFit(id) {
    onChange({ ...framing, fit: id })
  }

  function handleXChange(event) {
    onChange({ ...framing, x: Number(event.target.value) })
  }

  function handleYChange(event) {
    onChange({ ...framing, y: Number(event.target.value) })
  }

  function handleReset() {
    onChange(DEFAULT_FRAMING)
  }

  return (
    <div className="framing-controls">
      <p className="framing-editing">
        {framingText.editing} <strong>{name}</strong>
      </p>

      <ChoiceList options={fitOptions} selectedId={framing.fit} onPick={handlePickFit} />

      <label className="framing-slider">
        <span className="framing-slider-label">{framingText.leftRight}</span>
        <input type="range" min="0" max="100" value={framing.x} onChange={handleXChange} />
      </label>

      <label className="framing-slider">
        <span className="framing-slider-label">{framingText.topBottom}</span>
        <input type="range" min="0" max="100" value={framing.y} onChange={handleYChange} />
      </label>

      <button className="framing-reset" onClick={handleReset}>
        {framingText.reset}
      </button>
    </div>
  )
}

export default FramingControls
