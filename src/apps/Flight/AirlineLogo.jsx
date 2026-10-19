// AirlineLogo: the airline's logo on a small light tile, top left of the boarding pass.
// The tile is light so dark logos still show on the dark card.
function AirlineLogo({ logo, airline }) {
  return (
    <div className="flight-logo">
      <img className="flight-logo-image" src={logo} alt={airline} />
    </div>
  )
}

export default AirlineLogo
