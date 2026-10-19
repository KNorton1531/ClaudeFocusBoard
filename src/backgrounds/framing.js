// framing.js: how a 16:9 background sits on the screen.
// Useful on screens that aren't 16:9, like a monitor turned on its side.
//
// A framing looks like this:
//   { fit: 'fill', x: 50, y: 50 }
//   fit  'fill' covers the whole screen and crops the edges.
//        'fit' shows the whole picture, with a blurred copy behind it.
//   x, y where the picture sits, from 0 (left / top) to 100 (right / bottom).
//
// Settings keep one framing per background id, plus one for the video
// background under the key 'video'.

export const DEFAULT_FRAMING = { fit: 'fill', x: 50, y: 50 }

// The key the video background's framing is saved under.
export const VIDEO_FRAMING_KEY = 'video'

export function findFraming(allFraming, key) {
  if (allFraming) {
    if (allFraming[key]) {
      return { ...DEFAULT_FRAMING, ...allFraming[key] }
    }
  }

  return DEFAULT_FRAMING
}

// The class names for the box that holds the picture or video (see framing.css).
export function framingClassName(framing) {
  if (framing.fit === 'fit') {
    return 'framed framed-fit'
  } else {
    return 'framed framed-fill'
  }
}

// framing.css reads the position from these CSS variables.
export function framingStyle(framing) {
  return { '--frame-x': framing.x + '%', '--frame-y': framing.y + '%' }
}

// How big the 16:9 picture is on a screen this size, in pixels.
// Matches .framed-fill and .framed-fit in framing.css.
export function pictureSize(fit, screenWidth, screenHeight) {
  if (fit === 'fit') {
    return {
      width: Math.min(screenWidth, (screenHeight * 16) / 9),
      height: Math.min((screenWidth * 9) / 16, screenHeight),
    }
  } else {
    return {
      width: Math.max(screenWidth, (screenHeight * 16) / 9),
      height: Math.max((screenWidth * 9) / 16, screenHeight),
    }
  }
}

// One side of a drag: turns pixels moved into a new x or y (0 to 100).
// "spare" is how much bigger the picture is than the screen that way.
// It's negative when the picture is smaller, which flips the direction, so the
// picture always follows the pointer.
function dragOneWay(start, moved, spare) {
  // The picture is the same size as the screen this way, so it can't move.
  if (Math.abs(spare) < 1) {
    return start
  }

  const changed = start - (moved / spare) * 100
  return Math.round(Math.min(100, Math.max(0, changed)))
}

// Where the picture sits after being dragged by moveX, moveY pixels.
export function dragFraming(startFraming, moveX, moveY, screenWidth, screenHeight) {
  const size = pictureSize(startFraming.fit, screenWidth, screenHeight)

  return {
    ...startFraming,
    x: dragOneWay(startFraming.x, moveX, size.width - screenWidth),
    y: dragOneWay(startFraming.y, moveY, size.height - screenHeight),
  }
}
