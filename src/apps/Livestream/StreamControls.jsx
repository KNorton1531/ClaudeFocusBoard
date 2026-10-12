// StreamControls: the media bar under the stream.
// Stream name and status, previous / play-pause / next, mute, volume,
// full screen, and ☰ to open the list of streams.
import { livestreamStatus } from '../../content/livestream.js'

function StreamControls({
  stream,
  status,
  isOn,
  volume,
  isMuted,
  hasOthers,
  onPlayPause,
  onStep,
  onToggleMute,
  onVolumeChange,
  onFullScreen,
  onOpenList,
}) {
  let playIcon = '▶'
  let playTitle = 'Play'
  if (isOn) {
    playIcon = '❚❚'
    playTitle = 'Pause'
  }

  let muteIcon = '🔊'
  let muteTitle = 'Mute'
  if (isMuted) {
    muteIcon = '🔇'
    muteTitle = 'Unmute'
  } else if (volume === 0) {
    muteIcon = '🔇'
  }

  let statusClassName = 'livestream-status'
  if (status === 'playing') {
    statusClassName = 'livestream-status livestream-status-live'
  }

  // Previous and next only show when there's more than one stream.
  let previousButton = null
  let nextButton = null
  if (hasOthers) {
    previousButton = (
      <button
        className="livestream-button"
        title="Previous stream"
        onClick={function () {
          onStep(-1)
        }}
      >
        ⏮
      </button>
    )

    nextButton = (
      <button
        className="livestream-button"
        title="Next stream"
        onClick={function () {
          onStep(1)
        }}
      >
        ⏭
      </button>
    )
  }

  return (
    <div className="livestream-controls">
      <div className="livestream-now">
        <span className="livestream-name">{stream.name}</span>
        <span className={statusClassName}>{livestreamStatus[status]}</span>
      </div>

      <div className="livestream-buttons">
        {previousButton}
        <button className="livestream-button livestream-play" title={playTitle} onClick={onPlayPause}>
          {playIcon}
        </button>
        {nextButton}
      </div>

      <div className="livestream-sound">
        <button className="livestream-button" title={muteTitle} onClick={onToggleMute}>
          {muteIcon}
        </button>
        <input
          className="livestream-volume"
          type="range"
          min="0"
          max="100"
          value={volume}
          title="Volume"
          onChange={function (event) {
            onVolumeChange(Number(event.target.value))
          }}
        />
        <button className="livestream-button" title="Full screen" onClick={onFullScreen}>
          ⛶
        </button>
        <button className="livestream-button" title="Streams" onClick={onOpenList}>
          ☰
        </button>
      </div>
    </div>
  )
}

export default StreamControls
