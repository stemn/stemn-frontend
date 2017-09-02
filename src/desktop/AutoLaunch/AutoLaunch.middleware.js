/** ********************************************

This middleware is used to run AutoLaunch
functions

It should only run on the main-thread

isHidden: will set the --hidden flag to the registry key.
Then open command becomes: "C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe" --process-start-args "--hidden"
The application then uses process.argv to start silently

********************************************* */

import { stat } from 'fs'
import { homedir } from 'os'
import pify from 'pify'
const statAsync = pify(stat)

import autoLaunch from 'auto-launch'
const stemnAutoLaunch = new autoLaunch({
  name: 'Stemn',
  isHidden: true,
})

export default store => next => (action) => {
  if (action.type == 'AUTO_LAUNCH/TOGGLE') {
    const autostart = () => (action.meta.status ? stemnAutoLaunch.enable() : stemnAutoLaunch.disable())

    store.dispatch({
      ...action,
      payload: autostart(),
    })
  } else if (action.type == 'AUTO_LAUNCH/GET_STATUS') {
    store.dispatch({
      ...action,
      payload: stemnAutoLaunch.isEnabled(),
    })
  } else {
    return next(action)
  }
}
