// Board: where the Apps live.
// Most Apps sit in a grid where they can be dragged and resized. The grid is
// always exactly the size of the board area, so the page never scrolls and
// an App can never be dragged out of view.
// Floating Apps (like the clock) sit in their own layer on top. That layer
// covers the whole screen, so they can go right up to the edges.
import ReactGridLayout, { noCompactor } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import AppFrame from '../AppFrame/AppFrame.jsx'
import FloatingApp from '../FloatingApp/FloatingApp.jsx'
import { findApp } from '../../apps/index.js'
import { useElementSize } from './useElementSize.js'
import { COLUMNS, ROWS, GAP, keepInside } from './grid.js'
import './Board.css'

function Board({ apps, onLayoutChange, onMoveApp, onOpenAppSettings, onHideApp, onRemoveApp, onAppSettingsChange }) {
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

  // One row's height, so that all the rows plus the gaps fill the board exactly.
  let rowHeight = 30
  if (isReady) {
    rowHeight = (height - GAP * (ROWS - 1)) / ROWS
  }

  if (rowHeight < 12) {
    rowHeight = 12
  }

  // The grid needs x, y, w, h and an id called "i" for each App.
  const layout = gridApps.map(function (app) {
    const appInfo = findApp(app.type)
    const spot = keepInside(app)

    return {
      i: app.id,
      x: spot.x,
      y: spot.y,
      w: spot.w,
      h: spot.h,
      minW: appInfo.minW,
      minH: appInfo.minH,
      maxW: COLUMNS,
      maxH: ROWS,
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
          settingsFields={appInfo.settingsFields}
          settings={app.settings}
          onSettingsChange={function (newSettings) {
            onAppSettingsChange(app.id, newSettings)
          }}
          onHide={function () {
            onHideApp(app.id)
          }}
          onRemove={function () {
            onRemoveApp(app.id)
          }}
        >
          <AppComponent appId={app.id} settings={app.settings} />
        </AppFrame>
      </div>
    )
  })

  let grid = null
  if (isReady) {
    grid = (
      <ReactGridLayout
        layout={layout}
        width={width}
        autoSize={false}
        // The grid must fill the board for real. Bounded dragging measures this
        // element's height, and a collapsed one stops Apps moving up and down.
        style={{ height: '100%' }}
        gridConfig={{
          cols: COLUMNS,
          maxRows: ROWS,
          rowHeight: rowHeight,
          margin: [GAP, GAP],
          containerPadding: [0, 0],
        }}
        dragConfig={{ bounded: true, handle: '.app-frame-bar', cancel: '.app-frame-button' }}
        compactor={noCompactor}
        onLayoutChange={onLayoutChange}
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
          onRemove={function () {
            onRemoveApp(app.id)
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
