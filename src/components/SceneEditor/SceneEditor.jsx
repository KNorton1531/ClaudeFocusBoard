// SceneEditor: change how the board looks while looking at it.
// Opened by the "Look" button in the menu bar.
// The Apps and bars fade away, so only the scene and the welcome message are left.
// The toolbar at the bottom has a tab each for background, colours, font and effects.
// On the Background tab, drag anywhere to slide the picture.
// Changes show straight away. Cancel (or Escape) puts back how it was.
// What a framing is: see backgrounds/framing.js.
import { useEffect, useRef, useState } from 'react'
import BackgroundTab from './BackgroundTab.jsx'
import ColoursTab from './ColoursTab.jsx'
import FontTab from './FontTab.jsx'
import EffectsTab from './EffectsTab.jsx'
import { findBackground } from '../../backgrounds/index.js'
import { VIDEO_FRAMING_KEY, findFraming, dragFraming } from '../../backgrounds/framing.js'
import { framingText } from '../../content/background-framing.js'
import { lookTabs, lookText } from '../../content/menu-bar.js'
import './SceneEditor.css'

function SceneEditor({ settings, onSettingsChange, onClose }) {
  // How it was when the editor opened, for Cancel.
  const [startingSettings] = useState(settings)

  const [selectedTab, setSelectedTab] = useState(lookTabs[0].id)

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
      themeId: startingSettings.themeId,
      fontId: startingSettings.fontId,
      effectId: startingSettings.effectId,
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

  // Only the Background tab can drag the picture.
  let surface = null
  if (selectedTab === 'background') {
    let surfaceClassName = 'scene-editor-surface'
    if (isDragging) {
      surfaceClassName = 'scene-editor-surface scene-editor-surface-dragging'
    }

    surface = (
      <div
        className={surfaceClassName}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    )
  }

  let page = null
  if (selectedTab === 'background') {
    page = (
      <BackgroundTab
        settings={settings}
        onSettingsChange={onSettingsChange}
        framing={framing}
        framingName={framingName}
        onChangeFraming={changeFraming}
      />
    )
  } else if (selectedTab === 'colours') {
    page = <ColoursTab settings={settings} onSettingsChange={onSettingsChange} />
  } else if (selectedTab === 'font') {
    page = <FontTab settings={settings} onSettingsChange={onSettingsChange} />
  } else if (selectedTab === 'effects') {
    page = <EffectsTab settings={settings} onSettingsChange={onSettingsChange} />
  }

  const tabButtons = lookTabs.map(function (tab) {
    let className = 'scene-editor-tab'
    if (tab.id === selectedTab) {
      className = 'scene-editor-tab scene-editor-tab-picked'
    }

    return (
      <button
        key={tab.id}
        className={className}
        onClick={function () {
          setSelectedTab(tab.id)
        }}
      >
        <span className="scene-editor-tab-icon">{tab.icon}</span>
        {tab.name}
      </button>
    )
  })

  return (
    <>
      {surface}

      <div className="scene-editor-bar" role="dialog" aria-label={lookText.title}>
        <div className="scene-editor-tabs">{tabButtons}</div>

        <div className="scene-editor-page">{page}</div>

        <div className="scene-editor-buttons">
          <button className="scene-editor-button" onClick={handleCancel}>
            {framingText.cancel}
          </button>
          <button className="scene-editor-button scene-editor-done" onClick={onClose}>
            {framingText.done}
          </button>
        </div>
      </div>
    </>
  )
}

export default SceneEditor
