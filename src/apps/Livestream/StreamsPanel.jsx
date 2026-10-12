// StreamsPanel: paste a link to add a stream, pick one to watch, and remove saved ones.
// Shown inside the Livestream App when you press the ☰ button.
import { useState } from 'react'
import { livestreamText } from '../../content/livestream.js'
import { parseStreamLink } from './streamLink.js'
import { fetchStreamTitle } from './streamTitle.js'

function StreamsPanel({ streams, shownId, onAdd, onRemove, onPick, onDone }) {
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [problem, setProblem] = useState('')

  // True while looking up the stream's title.
  const [isAdding, setIsAdding] = useState(false)

  async function handleAdd(event) {
    // Stops the form reloading the page.
    event.preventDefault()

    const videoId = parseStreamLink(link)
    if (videoId === null) {
      setProblem(livestreamText.badLink)
      return
    }

    for (const stream of streams) {
      if (stream.videoId === videoId) {
        setProblem(livestreamText.alreadyAdded)
        return
      }
    }

    // No name typed: look up the stream's title. If that fails, use a plain "YouTube stream".
    let streamName = name.trim()
    if (streamName === '') {
      setProblem('')
      setIsAdding(true)
      const title = await fetchStreamTitle(videoId)
      setIsAdding(false)

      if (title) {
        streamName = title
      } else {
        streamName = livestreamText.youtubeName
      }
    }

    onAdd({ id: videoId, videoId: videoId, name: streamName })
    setLink('')
    setName('')
    setProblem('')
  }

  let addLabel = livestreamText.addButton
  if (isAdding) {
    addLabel = livestreamText.adding
  }

  let problemArea = null
  if (problem !== '') {
    problemArea = <p className="livestream-problem">{problem}</p>
  }

  let savedArea = null
  if (streams.length === 0) {
    savedArea = <p className="livestream-message">{livestreamText.noSaved}</p>
  } else {
    const rows = streams.map(function (stream) {
      let className = 'livestream-list-pick'
      if (stream.id === shownId) {
        className = 'livestream-list-pick livestream-list-picked'
      }

      return (
        <li key={stream.id} className="livestream-list-row">
          <button
            className={className}
            onClick={function () {
              onPick(stream.id)
            }}
          >
            <span className="livestream-list-name">{stream.name}</span>
          </button>
          <button
            className="livestream-remove"
            title="Remove"
            onClick={function () {
              onRemove(stream.id)
            }}
          >
            ✕
          </button>
        </li>
      )
    })

    savedArea = <ul className="livestream-list">{rows}</ul>
  }

  return (
    <div className="livestream-panel">
      <div className="livestream-panel-top">
        <button className="livestream-pill" onClick={onDone}>
          {livestreamText.done}
        </button>
        <span className="livestream-panel-title">{livestreamText.streamsTitle}</span>
      </div>

      <form className="livestream-form" onSubmit={handleAdd}>
        <input
          className="livestream-input"
          type="text"
          value={link}
          placeholder={livestreamText.linkPlaceholder}
          onChange={function (event) {
            setLink(event.target.value)
          }}
        />
        <div className="livestream-form-row">
          <input
            className="livestream-input"
            type="text"
            value={name}
            placeholder={livestreamText.namePlaceholder}
            onChange={function (event) {
              setName(event.target.value)
            }}
          />
          <button className="livestream-pill" type="submit" disabled={isAdding}>
            {addLabel}
          </button>
        </div>
      </form>

      {problemArea}

      <div className="livestream-panel-title">{livestreamText.savedTitle}</div>
      {savedArea}
    </div>
  )
}

export default StreamsPanel
