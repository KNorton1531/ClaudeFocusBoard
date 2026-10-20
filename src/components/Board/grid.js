// grid.js: the size of the board, and the sums that keep Apps inside it.
// The board is always this many squares, whatever the window size, so every
// App keeps its place when the window is resized and nothing can be dragged
// out of view.
//
// There are two grid shapes. A wide screen uses 24 columns by 12 rows. A tall
// screen (like a monitor turned on its side) swaps them to 12 by 24, so the
// squares stay roughly square and Apps can still be made short and narrow.
// Each App remembers a spot for each shape: x, y, w, h for landscape, and
// "portrait" ({ x, y, w, h }) for portrait. Arranging one never moves the other.
export const LANDSCAPE = { name: 'landscape', columns: 24, rows: 12 }
export const PORTRAIT = { name: 'portrait', columns: 12, rows: 24 }
export const GAP = 14

// Picks the grid shape for a board this size.
export function findGridShape(width, height) {
  if (height > width) {
    return PORTRAIT
  } else {
    return LANDSCAPE
  }
}

// Where an App sits in this grid shape, or null if it hasn't got a spot
// there yet (e.g. the first time the board is seen on a tall screen).
export function findSpot(app, shape) {
  if (shape.name === 'portrait') {
    if (app.portrait) {
      return app.portrait
    } else {
      return null
    }
  }

  return { x: app.x, y: app.y, w: app.w, h: app.h }
}

// Apps can be resized from every side and corner.
// n = top, s = bottom, e = right, w = left.
export const RESIZE_HANDLES = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']

// The smallest and biggest an App can be, in grid squares.
// An app.config.js can set minW, minH, maxW and maxH. If the right size
// depends on its settings (like Weather's Tall and Wide layouts), it can
// have a sizeLimits(settings) function instead, which wins.
// Nothing can be bigger than the grid itself.
export function findSizeLimits(appInfo, settings, shape) {
  let limits = { minW: 1, minH: 1, maxW: shape.columns, maxH: shape.rows }

  if (appInfo.sizeLimits) {
    limits = { ...limits, ...appInfo.sizeLimits(settings) }
  } else {
    for (const key of ['minW', 'minH', 'maxW', 'maxH']) {
      if (appInfo[key]) {
        limits[key] = appInfo[key]
      }
    }
  }

  const maxW = Math.min(limits.maxW, shape.columns)
  const maxH = Math.min(limits.maxH, shape.rows)

  return {
    minW: Math.min(limits.minW, maxW),
    minH: Math.min(limits.minH, maxH),
    maxW: maxW,
    maxH: maxH,
  }
}

// Brings a size into the limits, e.g. after an App's layout is changed.
export function keepInLimits(spot, limits) {
  const w = Math.min(Math.max(spot.w, limits.minW), limits.maxW)
  const h = Math.min(Math.max(spot.h, limits.minH), limits.maxH)

  return { ...spot, w: w, h: h }
}

// Pressing on any of these never starts a drag, so they still work as normal.
export const DRAG_CANCEL = 'button, input, textarea, select, a'

// Keeps one spot inside the grid, in case a saved App is too big or off the edge.
export function keepInside(spot, shape) {
  const w = Math.min(spot.w, shape.columns)
  const h = Math.min(spot.h, shape.rows)

  let x = Math.min(spot.x, shape.columns - w)
  let y = Math.min(spot.y, shape.rows - h)

  if (x < 0) {
    x = 0
  }

  if (y < 0) {
    y = 0
  }

  return { x: x, y: y, w: w, h: h }
}

// True when two Apps would sit on top of each other.
function overlaps(a, b) {
  if (a.x + a.w <= b.x) {
    return false
  }

  if (b.x + b.w <= a.x) {
    return false
  }

  if (a.y + a.h <= b.y) {
    return false
  }

  if (b.y + b.h <= a.y) {
    return false
  }

  return true
}

// Looks for the first empty space big enough for a new App, going left to
// right and then down. If the board is full, the new App goes in the top left.
// takenSpots is a list of { x, y, w, h } already in use in this grid shape.
export function findFreeSpot(takenSpots, w, h, shape) {
  const width = Math.min(w, shape.columns)
  const height = Math.min(h, shape.rows)

  for (let y = 0; y <= shape.rows - height; y = y + 1) {
    for (let x = 0; x <= shape.columns - width; x = x + 1) {
      const spot = { x: x, y: y, w: width, h: height }
      let isFree = true

      for (const taken of takenSpots) {
        if (overlaps(spot, keepInside(taken, shape))) {
          isFree = false
        }
      }

      if (isFree) {
        return spot
      }
    }
  }

  return { x: 0, y: 0, w: width, h: height }
}
