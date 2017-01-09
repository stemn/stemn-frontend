import { saveFile }     from './utils';
import downloadProgress from './downloadProgress';


export default ({fileUrl, filePath}) => {
  return (dispatch, getState) => {
    dispatch(downloadProgress(fileUrl, 0))
    saveFile({
      fileUrl,
      filePath,
      onProgress: (progress) => {
        dispatch(downloadProgress(fileUrl, progress))
      }
    })
  }
}