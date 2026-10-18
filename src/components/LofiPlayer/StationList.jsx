// StationList: the pop-up list of streams above the music bar.
// Picking a stream starts playing it straight away.
// Clicking anywhere outside it closes it, except on the music bar, whose
// buttons open and close the list themselves.
import { thumbnailUrl } from './thumbnailUrl.js'
import { useClickAway } from '../useClickAway.js'

function StationList({ streams, selectedId, onPick, onClose }) {
  const listRef = useClickAway(onClose, '.lofi-bar')

  const rows = streams.map(function (stream) {
    let className = 'station'
    if (stream.id === selectedId) {
      className = 'station station-picked'
    }

    return (
      <button
        key={stream.id}
        className={className}
        onClick={function () {
          onPick(stream.id)
        }}
      >
        <img className="station-thumb" src={thumbnailUrl(stream.videoId)} alt="" />
        <span className="station-text">
          <span className="station-name">{stream.name}</span>
          <span className="station-channel">{stream.channel}</span>
        </span>
      </button>
    )
  })

  return (
    <div className="station-list" ref={listRef}>
      {rows}
    </div>
  )
}

export default StationList
