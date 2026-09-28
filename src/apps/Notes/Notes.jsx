// Notes: a sticky note. Text is saved as you type.
import { useState } from 'react'
import { loadData, saveData } from '../../storage/storage.js'
import './Notes.css'

function Notes({ appId }) {
  // Each note saves under its own key, so you can have more than one.
  const storageKey = 'note-' + appId

  const [text, setText] = useState(function () {
    const saved = loadData(storageKey)

    if (saved) {
      return saved
    } else {
      return ''
    }
  })

  function handleChange(event) {
    setText(event.target.value)
    saveData(storageKey, event.target.value)
  }

  return (
    <textarea
      className="notes"
      value={text}
      onChange={handleChange}
      placeholder="Write something..."
    />
  )
}

export default Notes
