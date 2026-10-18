// useClickAway: calls onAway when the user clicks anywhere outside an element.
// Used to close pop-ups (menus, the stream list) by clicking away from them.
// Put the returned elementRef on the pop-up.
//
// Clicks inside "ignoreSelector" don't count. Use it for the buttons that open
// the pop-up, so pressing them again still toggles it instead of closing and
// reopening it straight away.
import { useEffect, useRef } from 'react'

export function useClickAway(onAway, ignoreSelector) {
  const elementRef = useRef(null)

  // Always call the newest onAway, without adding the listener again every render.
  const onAwayRef = useRef(onAway)
  useEffect(function () {
    onAwayRef.current = onAway
  })

  useEffect(
    function () {
      // "pointerdown" happens before "click", so this runs before any button reacts.
      function handlePointerDown(event) {
        const element = elementRef.current

        if (!element) {
          return
        }

        if (element.contains(event.target)) {
          return
        }

        if (event.target.closest(ignoreSelector)) {
          return
        }

        onAwayRef.current()
      }

      document.addEventListener('pointerdown', handlePointerDown)

      return function () {
        document.removeEventListener('pointerdown', handlePointerDown)
      }
    },
    [ignoreSelector],
  )

  return elementRef
}
