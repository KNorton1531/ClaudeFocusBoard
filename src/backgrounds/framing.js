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
