import electron from 'electron';

const forwardToRenderer = store => next => action => {

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const openWindows = electron.remote.BrowserWindow.getAllWindows();
  if(action.meta && action.meta.scope == 'menubarRenderer' && openWindows[1]){
    openWindows[1].webContents.send('redux-action', rendererAction)
  }
  else if(action.meta && action.meta.scope == 'mainRenderer' && openWindows[0]){
    openWindows[0].webContents.send('redux-action', rendererAction)
  }

  return next(action);
};

export default forwardToRenderer;
