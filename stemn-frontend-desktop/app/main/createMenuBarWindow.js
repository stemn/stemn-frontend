import { screen } from 'electron'
import { createAppWindow, loadRenderer, windows } from './windows.js'

const WINDOW_WIDTH = 330
const WINDOW_HEIGHT = 450
const HORIZ_PADDING = 15
const VERT_PADDING = 30

const getTrayPosX = (cursorPosition, trayPositionHoriz, primarySize) => {
  // Find the horizontal bounds if the window were positioned normally
  const horizBounds = {
    left: cursorPosition.x - WINDOW_WIDTH / 2,
    right: cursorPosition.x + WINDOW_WIDTH / 2,
  }
  // If the window crashes into the side of the screen, reposition
  if (trayPositionHoriz === 'left') {
    return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left
  }
  return horizBounds.right >= primarySize.width
    ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH
    : horizBounds.right - WINDOW_WIDTH
}

const getTrayPosY = (cursorPosition, trayPositionVert) =>
  trayPositionVert === 'bottom' ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING

/** The small "menubar" window that pops up from the tray icon */
export const create = () => {
  let lastPosition = false

  const browserWindow = createAppWindow({
    name: 'menubar',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    title: 'Stemn',
  })

  loadRenderer(browserWindow, 'menubar', '/')

  // Behave like a popover: hide when it loses focus (STEMN_MENUBAR_STAY_OPEN keeps it open for tests)
  browserWindow.on('blur', () => {
    if (!process.env.STEMN_MENUBAR_STAY_OPEN) browserWindow.hide()
  })

  const show = ({ reposition } = {}) => {
    if (reposition || !lastPosition) {
      const cursorPosition = screen.getCursorScreenPoint()
      const primarySize = screen.getDisplayNearestPoint(cursorPosition).workAreaSize
      const trayPositionVert = cursorPosition.y >= primarySize.height / 2 ? 'bottom' : 'top'
      const trayPositionHoriz = cursorPosition.x >= primarySize.width / 2 ? 'right' : 'left'
      const x = Math.max(0, Math.round(getTrayPosX(cursorPosition, trayPositionHoriz, primarySize)))
      const y = Math.max(0, Math.round(getTrayPosY(cursorPosition, trayPositionVert)))
      browserWindow.setPosition(x, y)
      lastPosition = true
    }
    browserWindow.show()
    browserWindow.focus()
  }

  const handle = { browserWindow, show }
  windows.menubar = handle
  return handle
}
