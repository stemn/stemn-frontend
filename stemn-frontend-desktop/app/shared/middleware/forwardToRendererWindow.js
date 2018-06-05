import electron from 'electron'

const forwardToRenderer = store => next => (action) => {
  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  }

  const openWindows = electron.remote.BrowserWindow.getAllWindows()

  if (action.meta && action.meta.scope.includes('menubar') && openWindows[1]) {
    openWindows[1].webContents.send('redux-action', rendererAction)
  }

  if (action.meta && action.meta.scope.includes('main') && openWindows[0]) {
    openWindows[0].webContents.send('redux-action', rendererAction)
  }

  // If the scope is menubar or main, we close
  if (action.meta && action.meta.scope.includes('menubar') || action.meta && action.meta.scope.includes('main')) {
    return
  }

  return next(action)
}

export default forwardToRenderer
