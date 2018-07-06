import { renderFileDownload, renderFileError, renderFileProgress } from 'stemn-shared/misc/Files/Files.actions.js'

export default (store, action) => {
  const {
    dispatch,
  } = store

  switch (action.type) {
    //    case 'RENDER/RENDER_COMPLETE':
    //      return dispatch(renderFileDownload({
    //        projectId   : action.payload.projectId,
    //        fileId      : action.payload.fileId,
    //        revisionId  : action.payload.revisionId,
    //        provider    : action.payload.provider,
    //        timestamp   : action.payload.timestamp,
    //      }))
    case 'RENDER/RENDER_DOWNLOAD':
      return dispatch(renderFileDownload({
        projectId: action.payload.projectId,
        fileId: action.payload.fileId,
        revisionId: action.payload.revisionId,
        provider: action.payload.provider,
        timestamp: action.payload.timestamp,
      }))
    case 'RENDER/RENDER_FAILED':
      return dispatch(renderFileError({
        fileId: action.payload.fileId,
        revisionId: action.payload.revisionId,
        error: action.payload.error,
      }))
    case 'RENDER/RENDER_PROGRESS':
      return dispatch(renderFileProgress({
        renderId: action.payload.roomId,
        message: action.payload.message,
      }))
  }
}
