import { modeled } from 'react-redux-form';

const initialState = {
  providerPath: {
    dropbox: null,
    drive: null,
    onedrive: null,
  },
  checkingForUpdate: false,
  updateAvailable: false,
  updateDownloaded: false,
  release: {},
  updateError: false,
  updateNotAvailable: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SYSTEM/GET_PROVIDER_PATH_FULFILLED': {
      return {
        ...state,
        providerPath: {
          dropbox: action.payload.dropbox,
          drive: action.payload.drive,
          onedrive: action.payload.onedrive,
        }
      };
    }

    case 'SYSTEM/CHECKING_FOR_UPDATE': {
      return {
        ...state,
        ...initialState,
        checkingForUpdate: true,
      };
    }

    case 'SYSTEM/UPDATE_AVAILABLE': {
      return {
        ...state,
        ...initialState,
        updateAvailable: true,
      };
    }

    case 'SYSTEM/UPDATE_DOWNLOADED': {
      const { releaseNotes, releaseName, releaseDate, updateURL } = action.payload;
      return {
        ...state,
        ...initialState,
        updateDownloaded: true,
        release: {
          releaseNotes,
          releaseName,
          releaseDate,
          updateURL,
        },
      };
    }

    case 'SYSTEM/UPDATE_ERROR': {
      return {
        ...state,
        ...initialState,
        updateError: action.payload,
      };
    }

    case 'SYSTEM/UPDATE_NOT_AVAILABLE': {
      return {
        ...state,
        ...initialState,
        updateNotAvailable: true,
      };
    }

    default:
      return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'system')(state, action)
}


