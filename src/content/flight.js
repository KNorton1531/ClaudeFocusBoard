// flight.js: the words used by the Flight App.

// Messages the Flight App shows.
export const flightText = {
  notSetUp: 'The flight feed isn\'t set up yet. See "Flight" in docs/04-apps.md.',
  findingYou: 'Finding where you are...',
  locationFailed: "Couldn't get your location. Allow it in your browser, or pick a place instead.",
  pickPlace: 'Pick a place',
  changePlace: 'Change place',
  pickerTitle: 'Watch the skies over...',
  searchPlaceholder: 'Town or city',
  searchButton: 'Search',
  searching: 'Searching...',
  searchFailed: "Couldn't search right now. Try again soon.",
  noResults: 'No places found.',
  cancel: 'Cancel',
  loading: 'Scanning the skies...',
  loadFailed: "Couldn't reach the flight feed. It will try again soon.",
  noFlights: 'No airliners nearby right now. Checking again soon.',
  nextFlight: 'Next flight',
  from: 'From',
  to: 'To',
  altitude: 'Altitude',
  speed: 'Speed',
  away: 'Away',
  look: 'Look',
  climbing: 'Climbing',
  descending: 'Descending',
  cruising: 'Cruising',
}

// Which way to look, from the direction in degrees. 0 is north, 90 is east.
// Eight slices of 45 degrees each, starting at north.
export const compassNames = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west']

// Operators that fly airline-style callsigns but are private jets, not airliners.
// Add more ICAO codes (the first 3 letters of the callsign) if they sneak in.
export const notAirlines = ['EJA', 'NJE', 'LXJ', 'VJT', 'XRO', 'GAC', 'JTL']
