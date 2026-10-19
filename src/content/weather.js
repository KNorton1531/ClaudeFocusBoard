// weather.js: the words and icons used by the Weather App.

// The little arrows beside the sunrise (up) and sunset (down) times.
export const sunIcons = { sunrise: '↑', sunset: '↓' }

// What each Open-Meteo weather code means.
// Open-Meteo sends a number (a "WMO code") instead of words.
// "icon" is used in the day, "nightIcon" at night.
// Full list: https://open-meteo.com/en/docs (search for "WMO Weather interpretation codes").
export const weatherCodes = {
  0: { name: 'Clear sky', icon: '☀️', nightIcon: '🌙' },
  1: { name: 'Mostly clear', icon: '🌤️', nightIcon: '🌙' },
  2: { name: 'Partly cloudy', icon: '⛅', nightIcon: '☁️' },
  3: { name: 'Cloudy', icon: '☁️', nightIcon: '☁️' },
  45: { name: 'Fog', icon: '🌫️', nightIcon: '🌫️' },
  48: { name: 'Icy fog', icon: '🌫️', nightIcon: '🌫️' },
  51: { name: 'Light drizzle', icon: '🌦️', nightIcon: '🌧️' },
  53: { name: 'Drizzle', icon: '🌦️', nightIcon: '🌧️' },
  55: { name: 'Heavy drizzle', icon: '🌧️', nightIcon: '🌧️' },
  56: { name: 'Freezing drizzle', icon: '🌧️', nightIcon: '🌧️' },
  57: { name: 'Freezing drizzle', icon: '🌧️', nightIcon: '🌧️' },
  61: { name: 'Light rain', icon: '🌦️', nightIcon: '🌧️' },
  63: { name: 'Rain', icon: '🌧️', nightIcon: '🌧️' },
  65: { name: 'Heavy rain', icon: '🌧️', nightIcon: '🌧️' },
  66: { name: 'Freezing rain', icon: '🌧️', nightIcon: '🌧️' },
  67: { name: 'Freezing rain', icon: '🌧️', nightIcon: '🌧️' },
  71: { name: 'Light snow', icon: '🌨️', nightIcon: '🌨️' },
  73: { name: 'Snow', icon: '🌨️', nightIcon: '🌨️' },
  75: { name: 'Heavy snow', icon: '❄️', nightIcon: '❄️' },
  77: { name: 'Snow grains', icon: '🌨️', nightIcon: '🌨️' },
  80: { name: 'Light showers', icon: '🌦️', nightIcon: '🌧️' },
  81: { name: 'Showers', icon: '🌧️', nightIcon: '🌧️' },
  82: { name: 'Heavy showers', icon: '🌧️', nightIcon: '🌧️' },
  85: { name: 'Snow showers', icon: '🌨️', nightIcon: '🌨️' },
  86: { name: 'Heavy snow showers', icon: '🌨️', nightIcon: '🌨️' },
  95: { name: 'Thunderstorm', icon: '⛈️', nightIcon: '⛈️' },
  96: { name: 'Thunderstorm with hail', icon: '⛈️', nightIcon: '⛈️' },
  99: { name: 'Thunderstorm with hail', icon: '⛈️', nightIcon: '⛈️' },
}

// Used if Open-Meteo ever sends a code that isn't in the list above.
export const unknownWeather = { name: 'Weather', icon: '🌡️', nightIcon: '🌡️' }

// Messages the Weather App shows.
export const weatherText = {
  myLocation: 'My location',
  findingYou: 'Finding where you are...',
  locationFailed: "Couldn't get your location. Allow it in your browser, or add a place.",
  loading: 'Getting the weather...',
  loadFailed: "Couldn't load the weather. It will try again soon.",
  noPlaces: 'No places yet.',
  addPlace: 'Add a place',
  placesTitle: 'Places',
  searchPlaceholder: 'Search for a town or city',
  searchButton: 'Search',
  searching: 'Searching...',
  noResults: 'No places found.',
  searchFailed: "Search didn't work. Try again.",
  savedTitle: 'Saved places',
  noSaved: 'Nothing saved yet. Search above to add one.',
  done: 'Done',
  feelsLike: 'Feels like',
  rain: 'Rain',
  humidity: 'Humidity',
  wind: 'Wind',
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  // Shown when the sun doesn't rise or set that day (far north or south).
  noSunTime: '--:--',
}
