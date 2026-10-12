// grid.js: the size of the board, and the sums that keep Apps inside it.
// The board is always this many squares, whatever the window size, so every
// App keeps its place when the window is resized and nothing can be dragged
// out of view.
export const COLUMNS = 24
export const ROWS = 12
export const GAP = 14

// Keeps one App inside the grid, in case a saved App is too big or off the edge.
export function keepInside(app) {
  const w = Math.min(app.w, COLUMNS)
  const h = Math.min(app.h, ROWS)

  let x = Math.min(app.x, COLUMNS - w)
  let y = Math.min(app.y, ROWS - h)

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
export function findFreeSpot(takenApps, w, h) {
  const width = Math.min(w, COLUMNS)
  const height = Math.min(h, ROWS)

  for (let y = 0; y <= ROWS - height; y = y + 1) {
    for (let x = 0; x <= COLUMNS - width; x = x + 1) {
      const spot = { x: x, y: y, w: width, h: height }
      let isFree = true

      for (const taken of takenApps) {
        if (overlaps(spot, keepInside(taken))) {
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
