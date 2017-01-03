import i from 'icepick';
import { uniq } from 'lodash';

const initialState = {
  fileData          : {},
  fileRenders       : {},
  fileMeta          : {},
  fileAssemblyParts : {},
  fileAssemblies    : {},
  pathToId          : {},
  downloadProgress  : {},
  relatedTasks      : {},
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
      return i.chain(state)
      // Create an entry for each part that links it to the assembly
      .updateIn(['fileAssemblies'], (allParts) => {
        const newParts = action.payload.data.reduce((accum, current) => {
          // Assign the assembly cachekey to each part
          accum[current.fileId+'-'+current.revisionId] = [action.meta.cacheKey];
          return accum
        }, {});

        const resolver = (targetVal, sourceVal) => Array.isArray(targetVal) && sourceVal ? uniq(targetVal.concat(sourceVal)) : sourceVal;
        return i.merge(allParts, newParts, resolver);
      })
      .assocIn(['fileAssemblyParts', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false
      })
      .value();

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

