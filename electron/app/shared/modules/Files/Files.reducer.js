import i from 'icepick'
const initialState = {
  fileData    : {},
  fileRenders : {},
  fileMeta    : {},
  pathToId    : {},
  downloadProgress: {},
  relatedTasks: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FILES/GET_FILE_PENDING' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_FILE_REJECTED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey], {
        error: action.payload.data,
        loading: false
      })
    case 'FILES/GET_FILE_FULFILLED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })
    case 'FILES/GET_FILE_PROGRESS':
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'percentage'], action.payload.percentage)

    case 'FILES/RENDER_FILE_PENDING' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey, 'loading'], true)
    case 'FILES/RENDER_FILE_REJECTED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        error: action.payload.response.data.error,
        loading: false
      })
    case 'FILES/RENDER_FILE_FULFILLED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

    case 'FILES/GET_META_PENDING' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_META_REJECTED' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_META_FULFILLED' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

    case 'FILES/GET_RELATED_TASKS_PENDING' :
      return i.assocIn(state, ['relatedTasks', action.meta.fileId, 'loading'], true)
    case 'FILES/GET_RELATED_TASKS_REJECTED' :
      return i.assocIn(state, ['relatedTasks', action.meta.fileId, 'loading'], false)
    case 'FILES/GET_RELATED_TASKS_FULFILLED' :
      return i.assocIn(state, ['relatedTasks', action.meta.fileId], {
        data: action.payload.data,
        loading: false
      })

    case 'FILES/GET_META_FROM_PATH_PENDING' :
      return i.assocIn(state, ['pathToId', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_META_FROM_PATH_REJECTED' :
      return i.assocIn(state, ['pathToId', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_META_FROM_PATH_FULFILLED' :
      return i.chain(state)
      .assocIn(['pathToId', action.meta.cacheKey], {
        data: action.payload.data.fileId,
        loading: false
      })
      .assocIn(['fileMeta', `${action.payload.data.fileId}`], {
        data: action.payload.data,
        loading: false
      })
      .value();

    case 'FILES/DOWNLOAD_PROGRESS' :
      return i.assocIn(state, ['downloadProgress', action.payload.cacheKey], action.payload.progress)

//    case 'FILES/GET_META_FULFILLED' :
//      return u({
//        [action.meta.cacheKey] : {
//          meta: action.payload.data
//        }
//      }, state);

    default:
        return state;
  }
}

