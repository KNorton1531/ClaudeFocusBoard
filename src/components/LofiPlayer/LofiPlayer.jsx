// LofiPlayer: the music bar at the bottom of the screen.
// Plays 24/7 lofi streams from YouTube, with play/pause, next/previous,
// volume and a list of streams. The list lives in content/lofi-streams.js.
//
// The stream's video is always on the page, just see-through. Turning on
// "video background" fades it in behind the Apps while the music plays.
// Fading instead of moving it means the stream never has to reload.
import { useState, useEffect, useRef } from 'react'
import StationList from './StationList.jsx'
import VideoStill from './VideoStill.jsx'
import { loadYouTubeApi } from './loadYouTubeApi.js'
import { fadeVolume } from './fadeVolume.js'
import { thumbnailUrl } from './thumbnailUrl.js'
import { lofiStreams } from '../../content/lofi-streams.js'
import { findFraming, framingClassName, framingStyle, VIDEO_FRAMING_KEY } from '../../backgrounds/framing.js'
import '../../backgrounds/framing.css'
import './LofiPlayer.css'

// The small line of text under the stream name, for each player state.
const STATUS_TEXT = {
  loading: 'Loading…',
  ready: 'Press play',
  buffering: 'Tuning in…',
  playing: 'Live',
  paused: 'Paused',
  error: "Can't play this stream",
}

// Settings for YouTube's player. Hides all of YouTube's own buttons,
// because the music bar has its own.
const PLAYER_VARS = {
  autoplay: 0,
  controls: 0,
  disablekb: 1,
  fs: 0,
  iv_load_policy: 3,
  modestbranding: 1,
  playsinline: 1,
  rel: 0,
}

function findStream(id) {
  for (const stream of lofiStreams) {
    if (stream.id === id) {
      return stream
    }
  }

  // Unknown id (maybe a stream was removed): fall back to the first one.
  return lofiStreams[0]
}

function LofiPlayer({ settings, onSettingsChange, isEditingScene }) {
  // One of the keys in STATUS_TEXT.
  const [playerState, setPlayerState] = useState('loading')

  const [isListOpen, setIsListOpen] = useState(false)

  const videoBoxRef = useRef(null)
  const playerRef = useRef(null)
  const fadeTimerRef = useRef(null)

  // True while waiting for the music to start, so it can fade in.
  const shouldFadeInRef = useRef(false)

  const stream = findStream(settings.lofiStreamId)
  const volume = settings.lofiVolume

  // The stream to load when the page first opens. Later changes go through pickStream.
  const firstVideoIdRef = useRef(stream.videoId)

  // Make YouTube's player once, when the bar first appears.
  useEffect(function () {
    const videoBox = videoBoxRef.current
    let isCancelled = false

    loadYouTubeApi().then(function (YT) {
      if (isCancelled) {
        return
      }

      // YouTube swaps this div for its own iframe.
      const host = document.createElement('div')
      videoBox.appendChild(host)

      playerRef.current = new YT.Player(host, {
        videoId: firstVideoIdRef.current,
        playerVars: { ...PLAYER_VARS, origin: window.location.origin },
        events: {
          onReady: function () {
            setPlayerState('ready')
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              setPlayerState('playing')
            } else if (event.data === YT.PlayerState.BUFFERING) {
              setPlayerState('buffering')
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlayerState('paused')
            } else if (event.data === YT.PlayerState.ENDED) {
              setPlayerState('paused')
            } else if (event.data === YT.PlayerState.CUED) {
              setPlayerState('ready')
            }
          },
          onError: function () {
            setPlayerState('error')
          },
        },
      })
    })

    return function () {
      isCancelled = true
      clearInterval(fadeTimerRef.current)

      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }

      videoBox.innerHTML = ''
    }
  }, [])

  function isPlayerReady() {
    if (!playerRef.current) {
      return false
    }

    if (playerState === 'loading') {
      return false
    }

    return true
  }

  function isMusicOn() {
    if (playerState === 'playing') {
      return true
    } else if (playerState === 'buffering') {
      return true
    } else {
      return false
    }
  }

  // Starts from silence. The fade up happens once the music really starts
  // (see the effect below), because a stream can take a moment to tune in.
  function fadeIn() {
    clearInterval(fadeTimerRef.current)
    playerRef.current.setVolume(0)
    shouldFadeInRef.current = true
  }

  useEffect(
    function () {
      if (playerState === 'playing') {
        if (shouldFadeInRef.current) {
          shouldFadeInRef.current = false
          clearInterval(fadeTimerRef.current)
          fadeTimerRef.current = fadeVolume(playerRef.current, 0, volume)
        }
      }
    },
    [playerState, volume],
  )

  function handlePlayPause() {
    if (!isPlayerReady()) {
      return
    }

    const player = playerRef.current

    if (isMusicOn()) {
      shouldFadeInRef.current = false
      clearInterval(fadeTimerRef.current)

      // Say "paused" straight away, so the cover picture fades in over the
      // video while the sound fades out.
      setPlayerState('paused')
      fadeTimerRef.current = fadeVolume(player, volume, 0, function () {
        player.pauseVideo()
      })
    } else {
      fadeIn()
      player.playVideo()

      // Play was pressed again before the fade out finished. The video never
      // stopped, so YouTube won't say it started. Tell the bar ourselves.
      if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        setPlayerState('playing')
      }
    }
  }

  function pickStream(id) {
    setIsListOpen(false)
    onSettingsChange({ ...settings, lofiStreamId: id })

    if (!isPlayerReady()) {
      return
    }

    fadeIn()
    setPlayerState('buffering')
    playerRef.current.loadVideoById(findStream(id).videoId)
  }

  // Moves through the list by "step" (1 = next, -1 = previous), wrapping round at the ends.
  function stepStream(step) {
    let index = lofiStreams.indexOf(stream) + step

    if (index >= lofiStreams.length) {
      index = 0
    } else if (index < 0) {
      index = lofiStreams.length - 1
    }

    pickStream(lofiStreams[index].id)
  }

  function handleVolumeChange(event) {
    const newVolume = Number(event.target.value)
    onSettingsChange({ ...settings, lofiVolume: newVolume })

    if (isPlayerReady()) {
      clearInterval(fadeTimerRef.current)
      playerRef.current.setVolume(newVolume)
    }
  }

  function handleToggleList() {
    if (isListOpen) {
      setIsListOpen(false)
    } else {
      setIsListOpen(true)
    }
  }

  function handleToggleVideoBackground() {
    if (settings.lofiVideoBackground) {
      onSettingsChange({ ...settings, lofiVideoBackground: false })
    } else {
      onSettingsChange({ ...settings, lofiVideoBackground: true })
    }
  }

  // The video only covers the background picture while the music is on.
  // Pausing fades it out, so the picture shows again.
  // The scene editor keeps it shown, so there's something to drag into place.
  let isVideoWanted = false
  if (isMusicOn()) {
    isVideoWanted = true
  } else if (isEditingScene) {
    isVideoWanted = true
  }

  let videoClassName = 'lofi-video'
  if (settings.lofiVideoBackground) {
    if (isVideoWanted) {
      if (playerState !== 'error') {
        videoClassName = 'lofi-video lofi-video-shown'
      }
    }
  }

  // The cover picture hides the video unless it's really playing.
  let isStillShown = true
  if (playerState === 'playing') {
    isStillShown = false
  }

  let playIcon = '▶'
  let playTitle = 'Play'
  if (isMusicOn()) {
    playIcon = '❚❚'
    playTitle = 'Pause'
  }

  let statusClassName = 'lofi-status'
  if (playerState === 'playing') {
    statusClassName = 'lofi-status lofi-status-live'
  }

  let videoButtonClassName = 'lofi-button'
  if (settings.lofiVideoBackground) {
    videoButtonClassName = 'lofi-button lofi-button-on'
  }

  let listButtonClassName = 'lofi-button'
  if (isListOpen) {
    listButtonClassName = 'lofi-button lofi-button-on'
  }

  let list = null
  if (isListOpen) {
    list = (
      <StationList
        streams={lofiStreams}
        selectedId={stream.id}
        onPick={pickStream}
        onClose={function () {
          setIsListOpen(false)
        }}
      />
    )
  }

  // How the video sits on the screen: fill or show it all, and where (see backgrounds/framing.js).
  // Only CSS changes here, so the stream never reloads.
  const framing = findFraming(settings.framing, VIDEO_FRAMING_KEY)

  // When the whole video is shown, a blurred copy of its picture fills the gaps around it.
  let backdrop = null
  if (framing.fit === 'fit') {
    backdrop = (
      <div
        className="framed-backdrop"
        style={{ backgroundImage: 'url(' + thumbnailUrl(stream.videoId, 'hqdefault') + ')' }}
      />
    )
  }

  return (
    <>
      <div className={videoClassName} style={framingStyle(framing)}>
        {backdrop}
        <div className={'lofi-video-box ' + framingClassName(framing)}>
          <div className="lofi-video-frame" ref={videoBoxRef} />
          <VideoStill key={stream.videoId} videoId={stream.videoId} isShown={isStillShown} />
        </div>
        <div className="lofi-video-shade" />
      </div>

      <div className="lofi-player">
        {list}

        <div className="lofi-bar">
          <button className="lofi-now" onClick={handleToggleList} title="Choose a stream">
            <img className="lofi-thumb" src={thumbnailUrl(stream.videoId)} alt="" />
            <span className="lofi-now-text">
              <span className="lofi-name">{stream.name}</span>
              <span className={statusClassName}>{STATUS_TEXT[playerState]}</span>
            </span>
          </button>

          <div className="lofi-controls">
            <button
              className="lofi-button"
              title="Previous stream"
              onClick={function () {
                stepStream(-1)
              }}
            >
              ⏮
            </button>
            <button className="lofi-button lofi-play" title={playTitle} onClick={handlePlayPause}>
              {playIcon}
            </button>
            <button
              className="lofi-button"
              title="Next stream"
              onClick={function () {
                stepStream(1)
              }}
            >
              ⏭
            </button>
          </div>

          <label className="lofi-volume" title="Volume">
            <span className="lofi-volume-icon">♪</span>
            <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
          </label>

          <div className="lofi-extras">
            <button className={listButtonClassName} title="Choose a stream" onClick={handleToggleList}>
              ☰
            </button>
            <button
              className={videoButtonClassName}
              title="Use the video as the background"
              onClick={handleToggleVideoBackground}
            >
              ▣
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LofiPlayer
