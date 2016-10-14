import { getViewerType } from 'app/renderer/main/modules/Files/PreviewFile/PreviewFile.utils.js';


//export function init({compareId, mode, provider, file1, file2}) {
//  const previewType1 = getViewerType(file1.extension, provider);
//  const previewType2 = file2 ? getViewerType(file2.extension, provider) : null;
//  return {
//    type: 'FILE_COMPARE/INIT',
//    payload: {
//      compareId,
//      previewType1,
//      previewType2,
//      file1,
//      file2
//    },
//  };
//}

export function changeMode({compareId, mode}) {
  return {
    type: 'FILE_COMPARE/CHANGE_MODE',
    payload: {
      compareId,
      mode
    },
  };
}
