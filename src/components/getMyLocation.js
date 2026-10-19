// getMyLocation.js: asks the browser where we are. Used by the Weather and Flight Apps.
// The browser shows a permission pop-up the first time.
export function getMyLocation() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      reject(new Error('This browser cannot share its location'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      function (error) {
        reject(error)
      },
      // Reuse a location up to 30 minutes old, and give up after 15 seconds.
      { maximumAge: 30 * 60 * 1000, timeout: 15000 },
    )
  })
}
