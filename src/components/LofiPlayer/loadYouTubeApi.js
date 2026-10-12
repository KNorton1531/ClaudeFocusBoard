// loadYouTubeApi: adds YouTube's player script to the page, once.
// Gives back a promise that finishes when "YT" (YouTube's player library) is ready.
let apiPromise = null

export function loadYouTubeApi() {
  if (apiPromise) {
    return apiPromise
  }

  apiPromise = new Promise(function (resolve) {
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }

    // YouTube's script calls this function by name when it has loaded.
    window.onYouTubeIframeAPIReady = function () {
      resolve(window.YT)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })

  return apiPromise
}
