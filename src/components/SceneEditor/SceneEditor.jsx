// SceneEditor: pick and move the background while looking at it.
// Opened from the Look window ("Try on screen" or "Adjust scene").
// The Apps, welcome message and bars fade away, so only the scene is left.
// The toolbar at the bottom picks the background and fill or fit.
// Drag anywhere to slide the picture.
// Changes show straight away. Cancel (or Escape) puts back how it was.
// What a framing is: see backgrounds/framing.js.
import { useEffect, useRef, useState } from 'react'
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker.jsx'
import { findBackground } from '../../backgrounds/index.js'
import { DEFAULT_FRAMING, VIDEO_FRAMING_KEY, findFraming, dragFraming } from '../../backgrounds/framing.js'
import { fitOptions, framingText } from '../../content/background-framing.js'
import './SceneEditor.css'

function SceneEditor({ settings, onSettingsChange, onClose }) {
  // How it was when the editor opened, for Cancel.
  const [startingSettings] = useState(settings)

  // Where the drag started, or null when not dragging.
  const dragRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // A class on <html> fades out everything but the scene (see SceneEditor.css).
  useEffect(function () {
    document.documentElement.classList.add('scene-editing')

    return function () {
      document.documentElement.classList.remove('scene-editing')
    }
  }, [])

  // This moves the video when it's the background, otherwise the picture.
  const background = findBackground(settings.backgroundId)
  let framingKey = background.id
  let framingName = background.name

  if (settings.lofiVideoBackground) {
    framingKey = VIDEO_FRAMING_KEY
    framingName = framingText.videoName
  }

  const framing = findFraming(settings.framing, framingKey)

  function changeFraming(newFraming) {
    const allFraming = { ...settings.framing, [framingKey]: newFraming }
    onSettingsChange({ ...settings, framing: allFraming })
  }

  function handleCancel() {
    onSettingsChange({
      ...settings,
      backgroundId: startingSettings.backgroundId,
      lofiVideoBackground: startingSettings.lofiVideoBackground,
      framing: startingSettings.framing,
    })
    onClose()
  }

  // Escape cancels, like closing a window.
  // No list of things to watch, so it re-runs each time and always uses the latest handleCancel.
  useEffect(function () {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return function () {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  // Picking a picture means you want to see it, so the video background turns off.
  function handlePickBackground(id) {
    onSettingsChange({ ...settings, backgroundId: id, lofiVideoBackground: false })
  }

  function handlePointerDown(event) {
    // Keeps getting the moves even if the pointer leaves the window.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, framing: framing }
    setIsDragging(true)
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag) {
      return
    }

    const moveX = event.clientX - drag.x
    const moveY = event.clientY - drag.y
    changeFraming(dragFraming(drag.framing, moveX, moveY, window.innerWidth, window.innerHeight))
  }

  function handlePointerUp() {
    dragRef.current = null
    setIsDragging(false)
  }

  function handlePickFit(id) {
    changeFraming({ ...framing, fit: id })
  }

  function handleCentre() {
    changeFraming(DEFAULT_FRAMING)
  }

  let surfaceClassName = 'scene-editor-surface'
  if (isDragging) {
    surfaceClassName = 'scene-editor-surface scene-editor-surface-dragging'
  }

  // With the video on, no picture is the background, so none is picked.
  let pickedBackgroundId = background.id
  if (settings.lofiVideoBackground) {
    pickedBackgroundId = ''
  }

  return (
    <>
      <div
        className={surfaceClassName}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className="scene-editor-bar" role="dialog" aria-label={framingText.title}>
        <BackgroundPicker selectedId={pickedBackgroundId} onPick={handlePickBackground} layout="strip" />

        <p className="scene-editor-hint">
          {framingText.editing} <strong>{framingName}</strong>. {framingText.dragHint}
        </p>

        <div className="scene-editor-controls">
          <ChoiceList options={fitOptions} selectedId={framing.fit} onPick={handlePickFit} />

          <div className="scene-editor-buttons">
            <button className="scene-editor-button" onClick={handleCentre}>
              {framingText.centre}
            </button>
            <button className="scene-editor-button" onClick={handleCancel}>
              {framingText.cancel}
            </button>
            <button className="scene-editor-button scene-editor-done" onClick={onClose}>
              {framingText.done}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SceneEditor
