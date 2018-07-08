import path from 'path'
import { Tray, Menu, shell } from 'electron'
import process from 'process'
import getRootPath from 'get-root-path'

// Actions
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { push } from 'react-router-redux'

const trayIcon = getRootPath('/static/images/logo.png', true)

let appIcon = null

export function create({ store, windows }) {
  if (appIcon !== null) return appIcon

  const { dispatch } = store

  appIcon = new Tray(trayIcon)
  appIcon.setToolTip('Stemn Desktop')

  let lastClickTime = Date.now()

  appIcon.on('right-click', (event, trayBounds) => {
    const { auth } = store.getState()
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Main Window',
        click: () => windows.main.show(),
      }, {
        label: 'Open Mini Window',
        click: () => windows.menubar.show(),
      }, {
        label: 'Open Website',
        click: () => shell.openExternal('https://stemn.com'),
      }, {
        type: 'separator',
      }, {
        label: 'Preferences',
        click: () => {
          windows.main.show()
          dispatch(push({
            pathname: '/settings/application',
            state: { meta: { scope: ['main'] } },
          }))
        },
      }, {
        label: 'Account Settings',
        enabled: !!(auth.authToken && auth.user._id),
        click: () => {
          windows.main.show()
          dispatch(push({
            pathname: '/settings/account',
            state: { meta: { scope: ['main'] } },
          }))
        },
      }, {
        type: 'separator',
      }, {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: () => dispatch(ElectronWindowsActions.quit()),
      },
    ])
    appIcon.popUpContextMenu(contextMenu)
  })
  appIcon.on('click', (event, trayBounds) => {
    const clickTimeout = 200
    if (process.platform === 'linux' && lastClickTime + clickTimeout > Date.now()) {
      windows.main.show() // double click action
    } else {
      windows.menubar.show({ reposition: true })
    }
    lastClickTime = Date.now()
  })
  appIcon.on('double-click', (event, trayBounds) => {
    windows.main.show()
  })

  return appIcon
}
