// Countdown: counts down the days to the countdowns you've picked.
// Built-in ones come from src/content/countdown-list.js. You pick which to show,
// and add your own, with the ☰ button. Both are saved under 'countdown-<appId>'.
//
// Settings choose "All at once" (a list, soonest first) or
// "One at a time", which moves on to the next one every few seconds.
import { useState, useEffect } from 'react'
import { loadData, saveData } from '../../storage/storage.js'
import { countdownList } from '../../content/countdown-list.js'
import { countdownText } from '../../content/countdown.js'
import { findNext } from './countdownInfo.js'
import CountdownList from './CountdownList.jsx'
import CountdownCard from './CountdownCard.jsx'
import CountdownPanel from './CountdownPanel.jsx'
import './Countdown.css'

// chosen: ids of the countdowns to show. mine: the ones you added yourself.
const EMPTY_SAVE = { chosen: [], mine: [] }

// How often to update the time left. Often enough for the minutes to tick over.
const TICK_SECONDS = 15

function Countdown({ appId, settings }) {
  const storageKey = 'countdown-' + appId

  const [saved, setSaved] = useState(function () {
    const fromStorage = loadData(storageKey)

    if (fromStorage) {
      return { ...EMPTY_SAVE, ...fromStorage }
    } else {
      return EMPTY_SAVE
    }
  })

  const [now, setNow] = useState(function () {
    return new Date()
  })

  // True while the Choose panel is open.
  const [isChoosing, setIsChoosing] = useState(false)

  // Which one "One at a time" is showing. It keeps counting up,
  // and wraps round the list when it's used (see shownIndex below).
  const [rotateCount, setRotateCount] = useState(0)

  function save(next) {
    setSaved(next)
    saveData(storageKey, next)
  }

  useEffect(function () {
    const timer = setInterval(function () {
      setNow(new Date())
    }, TICK_SECONDS * 1000)

    return function () {
      clearInterval(timer)
    }
  }, [])

  // The picked countdowns that still have a day coming up (or just passed), soonest first.
  const shown = []
  for (const countdown of [...countdownList, ...saved.mine]) {
    if (saved.chosen.includes(countdown.id)) {
      const next = findNext(countdown, now)

      if (next !== null) {
        shown.push({ countdown: countdown, next: next })
      }
    }
  }

  shown.sort(function (a, b) {
    return a.next.date - b.next.date
  })

  let shownIndex = 0
  if (shown.length > 0) {
    shownIndex = rotateCount % shown.length
  }

  // "One at a time": move on to the next one after a few seconds.
  // The timer starts again whenever the shown one changes.
  const isRotating = settings.mode === 'rotate'
  const rotateSeconds = Number(settings.rotateEvery)
  const shownCount = shown.length

  useEffect(
    function () {
      if (!isRotating) {
        return
      }

      if (shownCount < 2) {
        return
      }

      // Don't move on while you're choosing.
      if (isChoosing) {
        return
      }

      const timer = setTimeout(function () {
        setRotateCount(shownIndex + 1)
      }, rotateSeconds * 1000)

      return function () {
        clearTimeout(timer)
      }
    },
    [isRotating, shownCount, isChoosing, shownIndex, rotateSeconds],
  )

  function handleToggle(id) {
    if (saved.chosen.includes(id)) {
      const remaining = saved.chosen.filter(function (chosenId) {
        return chosenId !== id
      })
      save({ ...saved, chosen: remaining })
    } else {
      save({ ...saved, chosen: [...saved.chosen, id] })
    }
  }

  // A new one of your own is picked straight away.
  function handleAdd(countdown) {
    save({ mine: [...saved.mine, countdown], chosen: [...saved.chosen, countdown.id] })
  }

  function handleRemove(id) {
    const remainingMine = saved.mine.filter(function (countdown) {
      return countdown.id !== id
    })
    const remainingChosen = saved.chosen.filter(function (chosenId) {
      return chosenId !== id
    })

    save({ mine: remainingMine, chosen: remainingChosen })
  }

  function handleOpenPanel() {
    setIsChoosing(true)
  }

  function handleClosePanel() {
    setIsChoosing(false)
  }

  if (isChoosing) {
    return (
      <CountdownPanel
        mine={saved.mine}
        chosen={saved.chosen}
        now={now}
        onToggle={handleToggle}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onDone={handleClosePanel}
      />
    )
  }

  if (shown.length === 0) {
    return (
      <div className="countdown countdown-empty">
        <p className="countdown-message">{countdownText.nothingChosen}</p>
        <button className="countdown-pill" onClick={handleOpenPanel}>
          {countdownText.choose}
        </button>
      </div>
    )
  }

  let body = null
  if (isRotating) {
    const item = shown[shownIndex]
    body = (
      <CountdownCard
        countdown={item.countdown}
        next={item.next}
        now={now}
        showHours={settings.showHours}
        count={shown.length}
        shownIndex={shownIndex}
        onPick={setRotateCount}
      />
    )
  } else {
    body = <CountdownList items={shown} now={now} showHours={settings.showHours} />
  }

  // ☰ sits top left, out of the way of the frame's hover buttons (top right).
  return (
    <div className="countdown">
      <div className="countdown-top">
        <button className="countdown-round" title={countdownText.choose} onClick={handleOpenPanel}>
          ☰
        </button>
        <div className="countdown-title">{countdownText.title}</div>
      </div>
      {body}
    </div>
  )
}

export default Countdown
