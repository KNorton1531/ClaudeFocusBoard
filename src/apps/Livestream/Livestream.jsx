// Livestream: plays a YouTube livestream, with its own media bar.
// It starts empty. You paste links in with the ☰ button, and they're saved
// under 'livestream-<appId>', so each one keeps its own.
//
// youtubePlayer.js gives back simple controls for the player
// (play, pause, setVolume, setMuted, destroy).
import { useState, useEffect, useRef } from 'react'
import { loadData, saveData } from '../../storage/storage.js'
import { livestreamText } from '../../content/livestream.js'
import { makeYouTubePlayer } from './youtubePlayer.js'
import StreamControls from './StreamControls.jsx'
import StreamsPanel from './StreamsPanel.jsx'
import './Livestream.css'

const EMPTY_SAVE = { streams: [], shownId: null, volume: 70, isMuted: false }

function Livestream({ appId, settings }) {
  const storageKey = 'livestream-' + appId

  const [saved, setSaved] = useState(function () {
    const fromStorage = loadData(storageKey)

    if (fromStorage) {
      return { ...EMPTY_SAVE, ...fromStorage }
    } else {
      return EMPTY_SAVE
    }
  })

  // What the player is doing, and which stream that's about. If the stream
  // has just changed, the status is still about the old one, so we say 'loading'.
  const [statusFor, setStatusFor] = useState({ id: null, value: 'loading' })

  // True while the Streams panel (paste a link, saved list) is open.
  const [isListOpen, setIsListOpen] = useState(false)

  const appRef = useRef(null)
  const playerBoxRef = useRef(null)
  const playerRef = useRef(null)

  // Read by the player when it starts, without restarting it when they change.
  // save() keeps soundRef up to date.
  const soundRef = useRef({ volume: saved.volume, isMuted: saved.isMuted })
  const shouldPlayRef = useRef(false)

  function save(next) {
    setSaved(next)
    saveData(storageKey, next)
    soundRef.current = { volume: next.volume, isMuted: next.isMuted }
  }

  // Find the shown stream. If it was removed, fall back to the first one.
  let shownIndex = 0
  for (let i = 0; i < saved.streams.length; i = i + 1) {
    if (saved.streams[i].id === saved.shownId) {
      shownIndex = i
    }
  }

  let shown = null
  if (saved.streams.length > 0) {
    shown = saved.streams[shownIndex]
  }

  let shownId = null
  let shownVideoId = null
  if (shown) {
    shownId = shown.id
    shownVideoId = shown.videoId
  }

  let status = 'loading'
  if (statusFor.id === shownId) {
    status = statusFor.value
  }

  // Make a player for the shown stream. A new one is made whenever the stream changes.
  useEffect(
    function () {
      if (shownId === null) {
        return
      }

      const start = {
        volume: soundRef.current.volume,
        isMuted: soundRef.current.isMuted,
        isPlaying: shouldPlayRef.current,
      }
      shouldPlayRef.current = false

      function handleStatus(value) {
        setStatusFor({ id: shownId, value: value })
      }

      playerRef.current = makeYouTubePlayer(playerBoxRef.current, shownVideoId, start, handleStatus)

      return function () {
        playerRef.current.destroy()
        playerRef.current = null
      }
    },
    [shownId, shownVideoId],
  )

  function isOn() {
    if (status === 'playing') {
      return true
    } else if (status === 'buffering') {
      return true
    } else {
      return false
    }
  }

  function handlePlayPause() {
    if (!playerRef.current) {
      return
    }

    if (isOn()) {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
  }

  function showStream(id) {
    if (id === shownId) {
      return
    }

    // If the stream was playing, the next one starts playing too.
    shouldPlayRef.current = isOn()
    save({ ...saved, shownId: id })
  }

  // Moves through the list by "step" (1 = next, -1 = previous), wrapping round at the ends.
  function stepStream(step) {
    const count = saved.streams.length
    const index = (shownIndex + step + count) % count
    showStream(saved.streams[index].id)
  }

  function handleVolumeChange(volume) {
    // Moving the slider up also unmutes, like most players.
    let isMuted = saved.isMuted
    if (volume > 0) {
      isMuted = false
    }

    save({ ...saved, volume: volume, isMuted: isMuted })

    if (playerRef.current) {
      playerRef.current.setVolume(volume)
      playerRef.current.setMuted(isMuted)
    }
  }

  function handleToggleMute() {
    let isMuted = true
    if (saved.isMuted) {
      isMuted = false
    }

    save({ ...saved, isMuted: isMuted })

    if (playerRef.current) {
      playerRef.current.setMuted(isMuted)
    }
  }

  function handleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      appRef.current.requestFullscreen()
    }
  }

  function handleAdd(stream) {
    shouldPlayRef.current = isOn()
    save({ ...saved, streams: [...saved.streams, stream], shownId: stream.id })
    setIsListOpen(false)
  }

  function handleRemove(id) {
    const remaining = saved.streams.filter(function (stream) {
      return stream.id !== id
    })

    save({ ...saved, streams: remaining })
  }

  function handlePick(id) {
    showStream(id)
    setIsListOpen(false)
  }

  function handleOpenList() {
    setIsListOpen(true)
  }

  function handleCloseList() {
    setIsListOpen(false)
  }

  // The panel sits on top of the stream, so the stream keeps playing underneath.
  let panel = null
  if (isListOpen) {
    panel = (
      <div className="livestream-panel-cover">
        <StreamsPanel
          streams={saved.streams}
          shownId={shownId}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onPick={handlePick}
          onDone={handleCloseList}
        />
      </div>
    )
  }

  if (shown === null) {
    return (
      <div className="livestream">
        <div className="livestream-empty">
          <p className="livestream-message">{livestreamText.noStreams}</p>
          <button className="livestream-pill" onClick={handleOpenList}>
            {livestreamText.addStream}
          </button>
        </div>
        {panel}
      </div>
    )
  }

  let className = 'livestream'
  if (settings.showControls === 'hover') {
    className = 'livestream livestream-hover-controls'
  }

  return (
    <div className={className} ref={appRef}>
      <div className="livestream-screen" ref={playerBoxRef} />
      <StreamControls
        stream={shown}
        status={status}
        isOn={isOn()}
        volume={saved.volume}
        isMuted={saved.isMuted}
        hasOthers={saved.streams.length > 1}
        onPlayPause={handlePlayPause}
        onStep={stepStream}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onFullScreen={handleFullScreen}
        onOpenList={handleOpenList}
      />
      {panel}
    </div>
  )
}

export default Livestream
