// fadeVolume: slides the player's volume from one level to another,
// so the music never starts or stops suddenly.
// Gives back the timer, so a fade can be stopped early with clearInterval.
const FADE_MS = 800
const STEPS = 16

export function fadeVolume(player, from, to, onDone) {
  let step = 0

  const timer = setInterval(function () {
    step = step + 1
    const level = from + ((to - from) * step) / STEPS
    player.setVolume(Math.round(level))

    if (step >= STEPS) {
      clearInterval(timer)

      if (onDone) {
        onDone()
      }
    }
  }, FADE_MS / STEPS)

  return timer
}
