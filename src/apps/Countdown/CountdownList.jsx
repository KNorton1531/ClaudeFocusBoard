// CountdownList: "All at once" mode. Every shown countdown in a list, soonest first.
import { describeTimeLeft, findIcon, formatDate } from './countdownInfo.js'

function CountdownList({ items, now, showHours }) {
  const rows = items.map(function (item) {
    const timeLeft = describeTimeLeft(item.next, now, showHours)

    let timeText = timeLeft.label
    if (timeLeft.number !== null) {
      timeText = timeLeft.number + ' ' + timeLeft.label
    }

    // Today, or in its grace days.
    let className = 'countdown-row'
    if (item.next.daysLeft <= 0) {
      className = 'countdown-row countdown-reached'
    }

    return (
      <li key={item.countdown.id} className={className}>
        <span className="countdown-row-icon">{findIcon(item.countdown)}</span>
        <span className="countdown-row-words">
          <span className="countdown-row-name">{item.countdown.name}</span>
          <span className="countdown-row-date">{formatDate(item.next.date)}</span>
        </span>
        <span className="countdown-row-time">{timeText}</span>
      </li>
    )
  })

  return <ul className="countdown-list">{rows}</ul>
}

export default CountdownList
