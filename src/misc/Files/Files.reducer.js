import i from 'icepick';
import { uniq } from 'lodash';

const initialState = {
  hydrated            : false,
  fileData            : {},
  fileRenders         : {},
  fileMeta            : {},
  fileAssemblyParts   : {},
  fileAssemblyParents : {},
  pathToId            : {},
  downloadProgress    : {},
  relatedThreads        : {},
  websocketRooms      : []
};

function reducer(state, action) {
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
      const isRenderRequest = action.payload.data && action.payload.data.status;
      // If this was a render request, we do nothing - we wait for the websocket event to trigger the download
      return isRenderRequest ? state : i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })
    case 'FILES/RENDER_FILE_DOWNLOAD_PENDING' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey, 'loading'], true)
    case 'FILES/RENDER_FILE_DOWNLOAD_REJECTED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        error: action.payload.response.data.error,
        loading: false
      })
    case 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })

    case 'FILES/RENDER_FILE_PROGRESS' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        status: action.payload.message,
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

    case 'FILES/GET_ASSEMBLY_PARTS_PENDING' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_ASSEMBLY_PARTS_REJECTED' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_ASSEMBLY_PARTS_FULFILLED' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      });

    case 'FILES/GET_ASSEMBLY_PARENTS_PENDING' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_ASSEMBLY_PARENTS_REJECTED' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_ASSEMBLY_PARENTS_FULFILLED' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      });

    case 'FILES/GET_RELATED_THREADS_PENDING' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId, 'loading'], true)
    case 'FILES/GET_RELATED_THREADS_REJECTED' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId, 'loading'], false)
    case 'FILES/GET_RELATED_THREADS_FULFILLED' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId], {
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

    case 'FILES/WEBSOCKET_JOIN_FILE' :
      return i.updateIn(state, ['websocketRooms'], websocketRooms => i.push(websocketRooms, action.payload.payload.room))
    case 'FILES/WEBSOCKET_LEAVE_FILE' :
      return i.updateIn(state, ['websocketRooms'], websocketRooms => {
        const index = websocketRooms.findIndex(room => room == action.payload.payload.room);
        return index != -1 ? i.splice(websocketRooms, index, 1) : websocketRooms;
      })

    default:
        return state;
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return reducer(state, action)
}

