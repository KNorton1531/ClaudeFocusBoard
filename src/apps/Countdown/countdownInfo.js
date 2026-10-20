// countdownInfo.js: works out what to show for a countdown.
// How dates are written is explained at the top of src/content/countdown-list.js.
import { graceDays, countdownCategories } from '../../content/countdown-list.js'
import { countdownText } from '../../content/countdown.js'

const ONE_DAY = 1000 * 60 * 60 * 24

// Midnight at the start of a date, so day maths ignores the time.
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// "2027-03-28" to a Date at midnight.
function readFullDate(text) {
  const parts = text.split('-')
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
}

// Every day this countdown lands on around now, earliest first.
function findDates(countdown, now) {
  if (countdown.dates) {
    const dates = countdown.dates.map(readFullDate)
    dates.sort(function (a, b) {
      return a - b
    })
    return dates
  }

  const parts = countdown.date.split('-')

  if (parts.length === 2) {
    // "12-25": the same day every year. Last year is included so it can
    // still be in its grace days just after New Year.
    const year = now.getFullYear()
    const month = Number(parts[0]) - 1
    const day = Number(parts[1])
    return [new Date(year - 1, month, day), new Date(year, month, day), new Date(year + 1, month, day)]
  } else {
    return [readFullDate(countdown.date)]
  }
}

// The day to count down to, and how many days away it is
// (0 = today, -2 = two days ago). It can be a day that has just passed,
// if we're still in its grace days.
// Returns null if every day has passed, so it shouldn't be shown.
export function findNext(countdown, now) {
  let grace = graceDays
  if (countdown.graceDays !== undefined) {
    grace = countdown.graceDays
  }

  const today = startOfDay(now)

  for (const date of findDates(countdown, now)) {
    const daysLeft = Math.round((date - today) / ONE_DAY)

    if (daysLeft >= -grace) {
      // "03:00": counts down to that time on the day, instead of midnight.
      if (countdown.time) {
        const parts = countdown.time.split(':')
        date.setHours(Number(parts[0]), Number(parts[1]))
      }

      return { date: date, daysLeft: daysLeft }
    }
  }

  return null
}

// What to say about how long is left, in two parts:
// number (big, can be null) and label (the words with it).
// e.g. { number: 12, label: 'days to go' } or { number: null, label: "It's today!" }
export function describeTimeLeft(next, now, showHours) {
  if (next.daysLeft === 0) {
    return { number: null, label: countdownText.today }
  }

  if (next.daysLeft === -1) {
    return { number: null, label: countdownText.reachedYesterday }
  }

  if (next.daysLeft < 0) {
    const label = countdownText.reachedDaysAgo.replace('{days}', -next.daysLeft)
    return { number: null, label: label }
  }

  if (showHours) {
    // Counts to its time, or midnight at the start of the day if it has none.
    const minutesLeft = Math.floor((next.date - now) / (1000 * 60))
    const days = Math.floor(minutesLeft / (60 * 24))
    const hours = Math.floor((minutesLeft % (60 * 24)) / 60)
    const minutes = minutesLeft % 60

    let number = hours + 'h ' + minutes + 'm'
    if (days > 0) {
      number = days + 'd ' + number
    }

    return { number: number, label: countdownText.toGo }
  }

  if (next.daysLeft === 1) {
    return { number: 1, label: countdownText.dayToGo }
  } else {
    return { number: next.daysLeft, label: countdownText.daysToGo }
  }
}

// The countdown's own icon, or its category's if it hasn't got one.
export function findIcon(countdown) {
  if (countdown.icon) {
    return countdown.icon
  }

  for (const category of countdownCategories) {
    if (category.id === countdown.category) {
      return category.icon
    }
  }

  return ''
}

// e.g. "Fri 25 Dec 2026"
export function formatDate(date) {
  return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
