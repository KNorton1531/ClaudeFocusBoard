// FlightMessage: a message in the middle of the Flight App's card,
// for while it's waiting or if something goes wrong.
// Give it buttonText and onButton to show a button under the message.
function FlightMessage({ text, buttonText, onButton }) {
  let button = null
  if (onButton) {
    button = (
      <button className="flight-pill" onClick={onButton}>
        {buttonText}
      </button>
    )
  }

  return (
    <div className="flight flight-empty">
      <span className="flight-empty-icon">✈&#xFE0E;</span>
      <p className="flight-message">{text}</p>
      {button}
    </div>
  )
}

export default FlightMessage
