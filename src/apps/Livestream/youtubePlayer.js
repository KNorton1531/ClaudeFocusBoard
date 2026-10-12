// youtubePlayer: puts a YouTube player inside "box" and gives back simple
// controls for it, so Livestream.jsx doesn't need to know YouTube's own API.
//
// onStatus is called with 'ready', 'buffering', 'playing', 'paused' or 'error'.
import { loadYouTubeApi } from '../../components/LofiPlayer/loadYouTubeApi.js'

// Hides YouTube's own buttons, because the App has its own.
const PLAYER_VARS = {
  autoplay: 0,
  controls: 0,
  disablekb: 1,
  fs: 0,
  iv_load_policy: 3,
  modestbranding: 1,
  playsinline: 1,
  rel: 0,
}

export function makeYouTubePlayer(box, videoId, start, onStatus) {
  let player = null
  let isReady = false
  let isGone = false

  loadYouTubeApi().then(function (YT) {
    // The App was closed or the stream changed before YouTube loaded.
    if (isGone) {
      return
    }

    // YouTube swaps this div for its own iframe.
    const host = document.createElement('div')
    box.appendChild(host)

    player = new YT.Player(host, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: { ...PLAYER_VARS, origin: window.location.origin },
      events: {
        onReady: function () {
          isReady = true
          player.setVolume(start.volume)

          if (start.isMuted) {
            player.mute()
          }

          onStatus('ready')

          if (start.isPlaying) {
            player.playVideo()
          }
        },
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.PLAYING) {
            onStatus('playing')
          } else if (event.data === YT.PlayerState.BUFFERING) {
            onStatus('buffering')
          } else if (event.data === YT.PlayerState.PAUSED) {
            onStatus('paused')
          } else if (event.data === YT.PlayerState.ENDED) {
            onStatus('paused')
          } else if (event.data === YT.PlayerState.CUED) {
            onStatus('ready')
          }
        },
        onError: function () {
          onStatus('error')
        },
      },
    })
  })

  return {
    play: function () {
      if (isReady) {
        player.playVideo()
      }
    },
    pause: function () {
      if (isReady) {
        player.pauseVideo()
      }
    },
    // volume is 0 to 100.
    setVolume: function (volume) {
      if (isReady) {
        player.setVolume(volume)
      }
    },
    setMuted: function (isMuted) {
      if (!isReady) {
        return
      }

      if (isMuted) {
        player.mute()
      } else {
        player.unMute()
      }
    },
    destroy: function () {
      isGone = true

      if (player) {
        player.destroy()
      }

      box.innerHTML = ''
    },
  }
}
