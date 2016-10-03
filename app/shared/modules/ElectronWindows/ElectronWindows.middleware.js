/**********************************************

This middleware is sued to parse ELECTRON_WINDOW
events and update the electron browserWindow.

It should only run in the main-thread

**********************************************/

import { create as createPreview } from './windows/preview.js';

export default store => next => action => {
  if(action.type == 'ELECTRON_WINDOWS/PARSE') {
    const windows = action.payload;
    if(windows && windows.length > 0){
      windows.forEach(window => {
        if(window.type == 'PREVIEW'){
          createPreview({uri: `/preview/${window.props.fileId}/${window.props.revisionId}`});
        }
      })
    }
  }
  return next(action);
};
