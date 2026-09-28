// Board: the grid where Apps can be dragged and resized.
import ReactGridLayout, { useContainerWidth, noCompactor } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import AppFrame from '../AppFrame/AppFrame.jsx'
import { findApp } from '../../apps/index.js'
import './Board.css'

function Board({ apps, onLayoutChange, onRemoveApp }) {
  const { width, containerRef, mounted } = useContainerWidth()

  // Skip any saved App that no longer exists in apps/index.js.
  const knownApps = apps.filter(function (app) {
    if (findApp(app.type)) {
      return true
    } else {
      return false
    }
  })

  // The grid needs x, y, w, h and an id called "i" for each App.
  const layout = knownApps.map(function (app) {
    return { i: app.id, x: app.x, y: app.y, w: app.w, h: app.h, minW: 3, minH: 3 }
  })

  const appCards = knownApps.map(function (app) {
    const appInfo = findApp(app.type)
    const AppComponent = appInfo.component

    return (
      <div key={app.id}>
        <AppFrame
          title={appInfo.name}
          onClose={function () {
            onRemoveApp(app.id)
          }}
        >
          <AppComponent appId={app.id} />
        </AppFrame>
      </div>
    )
  })

  let grid = null
  if (mounted) {
    grid = (
      <ReactGridLayout
        layout={layout}
        width={width}
        gridConfig={{ cols: 24, rowHeight: 30, margin: [16, 16] }}
        dragConfig={{ handle: '.app-frame-bar', cancel: '.app-frame-close' }}
        compactor={noCompactor}
        onLayoutChange={onLayoutChange}
      >
        {appCards}
      </ReactGridLayout>
    )
  }

  return (
    <div className="board" ref={containerRef}>
      {grid}
    </div>
  )
}

export default Board
