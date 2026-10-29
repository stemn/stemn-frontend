import { Menu, Tray, nativeImage, shell } from 'electron'
import log from 'electron-log/main'
import { push } from 'stemn-shared/routing/actions'
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import trayIconPath from '../static/images/logo@2x.png?asset'
import { sendToWindow } from './ipc.js'

let appIcon = null

export function create({ store, windows }) {
  if (appIcon !== null) return appIcon

  const { dispatch } = store

  const navigateMain = (pathname) => {
    windows.main.show()
    sendToWindow('main', push({ pathname }))
  }

  const isLoggedIn = () => {
    const { auth } = store.getState()
    return !!(auth.authToken && auth.user && auth.user._id)
  }

  const buildMenu = () => Menu.buildFromTemplate([
    { label: 'Open Main Window', click: () => windows.main.show() },
    { label: 'Open Mini Window', click: () => windows.menubar.show({ reposition: true }) },
    { label: 'Open Website', click: () => shell.openExternal(GLOBAL_ENV.WEBSITE_URL) },
    { type: 'separator' },
    { label: 'Preferences', click: () => navigateMain('/settings/application') },
    {
      label: 'Account Settings',
      enabled: isLoggedIn(),
      click: () => navigateMain('/settings/account'),
    },
    { type: 'separator' },
    { label: 'Quit', click: () => dispatch(ElectronWindowsActions.quit()) },
  ])

  const icon = nativeImage.createFromPath(trayIconPath).resize({ width: 18, height: 18 })
  try {
    appIcon = new Tray(icon)
  } catch (error) {
    // e.g. no system tray on this desktop
    log.warn('Could not create the tray icon:', error.message)
    return null
  }
  appIcon.setToolTip('Stemn Desktop')

  // Linux (AppIndicator) only shows menus set with setContextMenu and emits no click events
  if (process.platform === 'linux') {
    let loggedIn = isLoggedIn()
    appIcon.setContextMenu(buildMenu())
    store.subscribe(() => {
      if (isLoggedIn() !== loggedIn) {
        loggedIn = isLoggedIn()
        appIcon.setContextMenu(buildMenu())
      }
    })
  }

  appIcon.on('right-click', () => appIcon.popUpContextMenu(buildMenu()))
  appIcon.on('click', () => windows.menubar.show({ reposition: true }))
  appIcon.on('double-click', () => windows.main.show())

  return appIcon
}
