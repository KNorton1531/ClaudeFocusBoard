// FlightMessage: a message in the middle of the Flight App's card,
// for while it's waiting or if something goes wrong.
function FlightMessage({ text }) {
  return (
    <div className="flight flight-empty">
      <span className="flight-empty-icon">✈&#xFE0E;</span>
      <p className="flight-message">{text}</p>
    </div>
  )
}

export default FlightMessage
