/** ********************************************

This middleware is used to run AutoLaunch
functions

It should only run on the main-thread

isHidden: starts the app with the --hidden flag
(the application then uses process.argv to start silently)

********************************************* */

import AutoLaunch from 'auto-launch'

let stemnAutoLaunch
const getAutoLaunch = () => {
  if (!stemnAutoLaunch) {
    stemnAutoLaunch = new AutoLaunch({
      name: 'Stemn',
      isHidden: true,
      // AppImages must point at the .AppImage file, not the extracted binary
      path: process.env.APPIMAGE || undefined,
    })
  }
  return stemnAutoLaunch
}

export default store => next => (action) => {
  if (action.type === 'AUTO_LAUNCH/TOGGLE') {
    const autostart = () => (action.meta.status ? getAutoLaunch().enable() : getAutoLaunch().disable())
    return store.dispatch({
      ...action,
      payload: autostart(),
    })
  } else if (action.type === 'AUTO_LAUNCH/GET_STATUS') {
    return store.dispatch({
      ...action,
      payload: getAutoLaunch().isEnabled(),
    })
  }
  return next(action)
}
