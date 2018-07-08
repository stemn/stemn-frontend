import { ipcRenderer } from 'electron'

const forwardToMain = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (!action.type ||
     action.type.substr(0, 2)  !== '@@' && (
       !action.meta       ||
      !action.meta.scope ||
      action.meta.scope !== 'local'
     )) {
    ipcRenderer.send('redux-action', action)
    // stop action in-flight
    return
  }
  return next(action) // eslint-disable-line consistent-return
}

export default forwardToMain
