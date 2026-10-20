// CountdownCard: "One at a time" mode. One countdown, big, with dots
// underneath to show where you are and jump to another.
import { describeTimeLeft, findIcon, formatDate } from './countdownInfo.js'

function CountdownCard({ countdown, next, now, showHours, count, shownIndex, onPick }) {
  const timeLeft = describeTimeLeft(next, now, showHours)

  // The big line is the number, or the words if there's no number ("It's today!").
  let big = null
  let small = null
  if (timeLeft.number === null) {
    big = <div className="countdown-card-words">{timeLeft.label}</div>
  } else {
    big = <div className="countdown-card-number">{timeLeft.number}</div>
    small = <div className="countdown-card-label">{timeLeft.label}</div>
  }

  // Today, or in its grace days.
  let className = 'countdown-card'
  if (next.daysLeft <= 0) {
    className = 'countdown-card countdown-reached'
  }

  // The dots only show when there's more than one.
  let dots = null
  if (count > 1) {
    const dotList = []
    for (let i = 0; i < count; i = i + 1) {
      let dotClass = 'countdown-dot'
      if (i === shownIndex) {
        dotClass = 'countdown-dot countdown-dot-shown'
      }

      dotList.push(
        <button
          key={i}
          className={dotClass}
          onClick={function () {
            onPick(i)
          }}
        />,
      )
    }

    dots = <div className="countdown-dots">{dotList}</div>
  }

  return (
    <div className={className}>
      <div className="countdown-card-middle">
        <div className="countdown-card-icon">{findIcon(countdown)}</div>
        <div className="countdown-card-name">{countdown.name}</div>
        {big}
        {small}
        <div className="countdown-card-date">{formatDate(next.date)}</div>
      </div>
      {dots}
    </div>
  )
}

export default CountdownCard
