// rearrange.js: how other Apps get out of the way while you drag or resize one.
//
// When a move starts, we remember where every App was. Then, every time the
// moving App shifts, the other Apps are worked out again from those starting
// spots (not from wherever they got pushed last time):
//   - An App that isn't in the way stays exactly where it started.
//   - An App that is in the way goes to the nearest empty space on the board.
// So if you drag an App back to where it was, everything else goes back too,
// and nothing is ever pushed off the board.
//
// The grid library calls compact() each time the layout changes. We tell it
// allowOverlap: true so it doesn't do its own pushing first; we do it here.
import { overlaps } from './grid.js'

export function createRearranger(shape) {
  let startLayout = null
  let movingId = null

  // Is this spot free of every spot in the list?
  function isFree(spot, takenSpots) {
    for (const taken of takenSpots) {
      if (overlaps(spot, taken)) {
        return false
      }
    }

    return true
  }

  // The empty space closest to where the App started, or null if there's none.
  function findNearestFreeSpot(item, takenSpots) {
    let best = null
    let bestDistance = Infinity

    for (let y = 0; y <= shape.rows - item.h; y = y + 1) {
      for (let x = 0; x <= shape.columns - item.w; x = x + 1) {
        const spot = { x: x, y: y, w: item.w, h: item.h }
        const distance = Math.abs(x - item.x) + Math.abs(y - item.y)

        if (distance < bestDistance && isFree(spot, takenSpots)) {
          best = spot
          bestDistance = distance
        }
      }
    }

    return best
  }

  return {
    type: null,
    allowOverlap: true,

    // Called when a drag or resize begins.
    startMove: function (layout, id) {
      startLayout = layout.map(function (item) {
        return { ...item }
      })
      movingId = id
    },

    // Called when the drag or resize ends.
    endMove: function () {
      startLayout = null
      movingId = null
    },

    compact: function (layout) {
      const copy = layout.map(function (item) {
        return { ...item }
      })

      // Not moving anything: leave the layout as it is.
      if (startLayout === null) {
        return copy
      }

      const moving = copy.find(function (item) {
        return item.i === movingId
      })

      if (!moving) {
        return copy
      }

      // First, every App that isn't in the way keeps its starting spot.
      const placed = [moving]
      const inTheWay = []

      for (const start of startLayout) {
        if (start.i !== movingId) {
          if (overlaps(start, moving)) {
            inTheWay.push(start)
          } else {
            placed.push({ ...start })
          }
        }
      }

      // Then each App that is in the way moves to the nearest empty space.
      // If the board is too full, it stays put rather than leaving the board.
      for (const start of inTheWay) {
        const spot = findNearestFreeSpot(start, placed)

        if (spot === null) {
          placed.push({ ...start })
        } else {
          placed.push({ ...start, x: spot.x, y: spot.y })
        }
      }

      // Keep the same order the grid gave us.
      return copy.map(function (item) {
        const found = placed.find(function (p) {
          return p.i === item.i
        })

        if (found) {
          return found
        } else {
          return item
        }
      })
    },
  }
}
