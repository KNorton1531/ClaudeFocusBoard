// FloatingApp: an App that floats freely on the board instead of sitting in
// the grid, like the clock. It is exactly the size of what it shows, so it
// can't be resized. Drag it from anywhere. Hovering blurs it and shows the
// settings and hide buttons on top.
//
// Its place is saved as "left" and "top", from 0 to 1: how far across and down
// the free space it sits. 0 is the left / top edge, 1 is the right / bottom edge.
// This keeps it in the same spot, and always on screen, when the window is resized.
import Draggable from 'react-draggable'
import { useElementSize } from '../Board/useElementSize.js'
import './FloatingApp.css'

function FloatingApp({ app, boardWidth, boardHeight, onMove, onOpenSettings, onHide, children }) {
  const { width, height, elementRef } = useElementSize()

  // How far the App can move before it hits the edge of the board.
  let spaceX = boardWidth - width
  if (spaceX < 0) {
    spaceX = 0
  }

  let spaceY = boardHeight - height
  if (spaceY < 0) {
    spaceY = 0
  }

  const position = { x: app.left * spaceX, y: app.top * spaceY }

  // When a drag ends, turn the pixel position back into 0 to 1 and save it.
  function handleDragStop(event, data) {
    let left = 0
    if (spaceX > 0) {
      left = data.x / spaceX
    }

    let top = 0
    if (spaceY > 0) {
      top = data.y / spaceY
    }

    onMove(left, top)
  }

  let className = 'floating-app'
  if (app.settings.minimal) {
    className = className + ' floating-app-minimal'
  }

  return (
    <Draggable
      nodeRef={elementRef}
      position={position}
      bounds="parent"
      cancel=".floating-app-button"
      onStop={handleDragStop}
    >
      <div className={className} ref={elementRef}>
        <div className="floating-app-content">{children}</div>
        <div className="floating-app-buttons">
          <button className="floating-app-button" onClick={onOpenSettings} title="Settings">
            ⚙
          </button>
          <button className="floating-app-button" onClick={onHide} title="Hide this app">
            ✕
          </button>
        </div>
      </div>
    </Draggable>
  )
}

export default FloatingApp
