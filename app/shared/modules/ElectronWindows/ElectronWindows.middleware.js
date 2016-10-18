/**********************************************

This middleware is used to parse ELECTRON_WINDOW
events and update the electron browserWindow.

It should only run in the main-thread

**********************************************/

import { create as createPreview } from './windows/preview.js';

export default store => next => action => {
  if(action.type == 'ELECTRON_WINDOWS/CREATE') {
    if(action.payload.type == 'PREVIEW'){
      const { projectId, fileId, revisionId } = action.payload.props;
      createPreview({uri: `/preview/${projectId}/${fileId}/${revisionId}`});
    }
  }
  return next(action);
};
