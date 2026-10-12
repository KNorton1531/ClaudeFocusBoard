// useElementSize: measures an element and keeps the size up to date
// whenever it changes, for example when the window is resized.
// Put the returned elementRef on the element you want to measure.
import { useState, useEffect, useRef } from 'react'

export function useElementSize() {
  const elementRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(function () {
    const element = elementRef.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(function () {
      setSize({ width: element.offsetWidth, height: element.offsetHeight })
    })

    observer.observe(element)

    return function () {
      observer.disconnect()
    }
  }, [])

  let isReady = false
  if (size.width > 0 && size.height > 0) {
    isReady = true
  }

  return { width: size.width, height: size.height, elementRef: elementRef, isReady: isReady }
}
