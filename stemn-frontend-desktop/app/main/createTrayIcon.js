import { Menu, Tray, dialog, nativeImage, shell } from 'electron'
import log from 'electron-log/main'
import { push } from 'stemn-shared/routing/actions'
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import trayIconPath from '../static/images/logo@2x.png?asset'
import { sendToWindow } from './ipc.js'
import { getUpdater } from './updater/index.js'

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

  /** Update entry of the menu: check / download / restart, depending on the updater state */
  const updateMenuItem = () => {
    const { autoUpdate } = store.getState()
    const updater = getUpdater()
    if (autoUpdate.updateDownloaded && autoUpdate.release.version) {
      return {
        label: `Restart to Update (${autoUpdate.release.version})`,
        click: async () => {
          const result = updater ? updater.quitAndInstall() : { ok: false, message: 'The updater has not started yet.' }
          if (!result.ok) {
            dialog
              .showMessageBox({
                type: 'info',
                title: 'Stemn',
                message: 'Stemn cannot restart yet',
                detail: result.message,
              })
              .catch(() => {})
          }
        },
      }
    }
    if (autoUpdate.updateAvailable && autoUpdate.available && !autoUpdate.available.autoDownload) {
      return {
        label: `Download Update (${autoUpdate.available.version})`,
        enabled: !!updater,
        click: () => updater && updater.download(),
      }
    }
    return {
      label: autoUpdate.checkingForUpdate ? 'Checking for Updates...' : 'Check for Updates...',
      enabled: !!updater && !autoUpdate.checkingForUpdate,
      click: () => {
        navigateMain('/settings/application')
        if (updater) updater.check({ manual: true })
      },
    }
  }

  const buildMenu = () =>
    Menu.buildFromTemplate([
      { label: 'Open Main Window', click: () => windows.main.show() },
      { label: 'Open Mini Window', click: () => windows.menubar.show({ reposition: true }) },
      { label: 'Open Website', click: () => shell.openExternal(GLOBAL_ENV.WEBSITE_URL) },
      { type: 'separator' },
      updateMenuItem(),
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
    const menuKey = () => {
      const { autoUpdate } = store.getState()
      return JSON.stringify([
        isLoggedIn(),
        autoUpdate.checkingForUpdate,
        autoUpdate.updateAvailable,
        autoUpdate.updateDownloaded,
        autoUpdate.release && autoUpdate.release.version,
        !!getUpdater(),
      ])
    }
    let key = menuKey()
    appIcon.setContextMenu(buildMenu())
    store.subscribe(() => {
      if (menuKey() !== key) {
        key = menuKey()
        appIcon.setContextMenu(buildMenu())
      }
    })
  }

  appIcon.on('right-click', () => appIcon.popUpContextMenu(buildMenu()))
  appIcon.on('click', () => windows.menubar.show({ reposition: true }))
  appIcon.on('double-click', () => windows.main.show())

  return appIcon
}
