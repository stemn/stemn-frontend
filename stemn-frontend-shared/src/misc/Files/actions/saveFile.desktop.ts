import { getFullPath } from './getFullPath.desktop'

/**
 * Save a file revision to disk. The save dialog and the download run in the
 * main process (FileSave.save) - renderers have no file system access.
 */
export const saveFile = ({ file, fileUrl }) => (dispatch) =>
  // First, we get the existing path of the file so we can direct the file save
  // dialog to this location
  dispatch(getFullPath({
    path: file.path,
    projectId: file.project._id,
    provider: file.provider,
  }))
    .catch(() => undefined)
    .then((filePath) => dispatch({
      type: 'FILES/SAVE_FILE',
      aliased: true,
      payload: {
        functionAlias: 'FileSave.save',
        functionInputs: { fileUrl, filePath },
      },
    }))
