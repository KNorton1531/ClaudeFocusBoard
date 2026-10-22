// Board: where the Apps live.
// Most Apps sit in a grid where they can be dragged and resized. The grid is
// always exactly the size of the board area, so the page never scrolls and
// an App can never be dragged out of view.
// Floating Apps (like the clock) sit in their own layer on top. That layer
// covers the whole screen, so they can go right up to the edges.
import { useMemo } from 'react'
import ReactGridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import AppFrame from '../AppFrame/AppFrame.jsx'
import FloatingApp from '../FloatingApp/FloatingApp.jsx'
import { findApp } from '../../apps/index.js'
import { useElementSize } from './useElementSize.js'
import { createRearranger } from './rearrange.js'
import {
  GAP,
  RESIZE_HANDLES,
  DRAG_CANCEL,
  findGridShape,
  findSpot,
  findFreeSpot,
  keepInside,
  findSizeLimits,
  keepInLimits,
} from './grid.js'
import './Board.css'

function Board({ apps, onLayoutChange, onMoveApp, onOpenAppSettings, onHideApp, onAppSettingsChange }) {
  const { width, height, elementRef, isReady } = useElementSize()
  const floatingLayer = useElementSize()

  // Only Apps that still exist in apps/index.js and are not hidden get drawn.
  const visibleApps = apps.filter(function (app) {
    if (!findApp(app.type)) {
      return false
    }

    if (app.hidden) {
      return false
    }

    return true
  })

  const gridApps = visibleApps.filter(function (app) {
    return !findApp(app.type).floating
  })

  const floatingApps = visibleApps.filter(function (app) {
    return findApp(app.type).floating
  })

  // 24 x 12 squares on a wide screen, 12 x 24 on a tall one (see grid.js).
  const shape = findGridShape(width, height)

  // Moves other Apps out of the way while one is dragged or resized (see rearrange.js).
  const rearranger = useMemo(function () {
    return createRearranger(shape)
  }, [shape])

  // One row's height, so that all the rows plus the gaps fill the board exactly.
  let rowHeight = 30
  if (isReady) {
    rowHeight = (height - GAP * (shape.rows - 1)) / shape.rows
  }

  if (rowHeight < 12) {
    rowHeight = 12
  }

  // Spots already used in this grid shape. Hidden Apps keep their place, so they count.
  const takenSpots = []
  for (const app of apps) {
    const appInfo = findApp(app.type)

    if (appInfo && !appInfo.floating) {
      const spot = findSpot(app, shape)

      if (spot !== null) {
        takenSpots.push(spot)
      }
    }
  }

  // The grid needs x, y, w, h and an id called "i" for each App.
  // An App with no spot in this grid shape yet gets the first free space at
  // its normal size. The size is kept inside the App's limits, then inside the board.
  const layout = gridApps.map(function (app) {
    const appInfo = findApp(app.type)
    const limits = findSizeLimits(appInfo, app.settings, shape)

    let savedSpot = findSpot(app, shape)
    if (savedSpot === null) {
      savedSpot = findFreeSpot(takenSpots, appInfo.w, appInfo.h, shape)
      takenSpots.push(savedSpot)
    }

    const spot = keepInside(keepInLimits(savedSpot, limits), shape)

    return {
      i: app.id,
      x: spot.x,
      y: spot.y,
      w: spot.w,
      h: spot.h,
      minW: limits.minW,
      minH: limits.minH,
      maxW: limits.maxW,
      maxH: limits.maxH,
      isBounded: true,
    }
  })

  const appCards = gridApps.map(function (app) {
    const appInfo = findApp(app.type)
    const AppComponent = appInfo.component

    return (
      <div key={app.id}>
        <AppFrame
          title={appInfo.name}
          compact={appInfo.compact}
          settingsFields={appInfo.settingsFields}
          settings={app.settings}
          onSettingsChange={function (newSettings) {
            onAppSettingsChange(app.id, newSettings)
          }}
          onHide={function () {
            onHideApp(app.id)
          }}
        >
          <AppComponent appId={app.id} settings={app.settings} />
        </AppFrame>
      </div>
    )
  })

  let grid = null
  if (isReady) {
    // key: switching between wide and tall starts a fresh grid, so the old
    // shape's spots are never saved as the new shape's.
    grid = (
      <ReactGridLayout
        key={shape.name}
        layout={layout}
        width={width}
        autoSize={false}
        // The grid must fill the board for real. Bounded dragging measures this
        // element's height, and a collapsed one stops Apps moving up and down.
        style={{ height: '100%' }}
        gridConfig={{
          cols: shape.columns,
          maxRows: shape.rows,
          rowHeight: rowHeight,
          margin: [GAP, GAP],
          containerPadding: [0, 0],
        }}
        // Drag by the title bar (or anywhere on a compact App), but never
        // start a drag from a button or a box you type in.
        dragConfig={{ bounded: true, handle: '.app-drag-handle', cancel: DRAG_CANCEL }}
        resizeConfig={{ enabled: true, handles: RESIZE_HANDLES }}
        compactor={rearranger}
        onDragStart={function (currentLayout, item) {
          rearranger.startMove(currentLayout, item.i)
        }}
        onDragStop={function () {
          rearranger.endMove()
        }}
        onResizeStart={function (currentLayout, item) {
          rearranger.startMove(currentLayout, item.i)
        }}
        onResizeStop={function () {
          rearranger.endMove()
        }}
        onLayoutChange={function (newLayout) {
          onLayoutChange(newLayout, shape)
        }}
      >
        {appCards}
      </ReactGridLayout>
    )
  }

  let floating = null
  if (floatingLayer.isReady) {
    floating = floatingApps.map(function (app) {
      const AppComponent = findApp(app.type).component

      return (
        <FloatingApp
          key={app.id}
          app={app}
          boardWidth={floatingLayer.width}
          boardHeight={floatingLayer.height}
          onMove={function (left, top) {
            onMoveApp(app.id, left, top)
          }}
          onOpenSettings={function () {
            onOpenAppSettings(app.id)
          }}
          onHide={function () {
            onHideApp(app.id)
          }}
        >
          <AppComponent appId={app.id} settings={app.settings} />
        </FloatingApp>
      )
    })
  }

  return (
    <>
      <div className="board" ref={elementRef}>
        {grid}
      </div>
      <div className="floating-layer" ref={floatingLayer.elementRef}>
        {floating}
      </div>
    </>
  )
}

export default Board
