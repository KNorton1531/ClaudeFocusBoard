// effects/index.js: the list of every effect you can turn on.
// Effects work on ANY background, unlike scene animations.
// To add one: make its folder, import it here, and add one line to the list.
import Rain from './Rain/Rain.jsx'
import Snow from './Snow/Snow.jsx'

// "none" has no component, which means nothing is drawn.
export const effectList = [
  { id: 'none', name: 'None', component: null },
  { id: 'rain', name: 'Rain', component: Rain },
  { id: 'snow', name: 'Snow', component: Snow },
]

export function findEffect(id) {
  for (const effect of effectList) {
    if (effect.id === id) {
      return effect
    }
  }

  // Unknown id: fall back to no effect.
  return effectList[0]
}
