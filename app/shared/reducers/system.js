import { modeled } from 'react-redux-form';

const initialState = {
  providerPath: {
    dropbox: null,
    drive: null,
    onedrive: null,
  },
  settings: {
    usageData: true
  },
  currentVersion: null,
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
          drive: action.payload.drive
        }
      };
    }

    case 'SYSTEM/CURRENT_VERSION': {
      return {
        ...state,
        currentVersion: action.payload.version,
      };
    }

    case 'SYSTEM/CHECKING_FOR_UPDATE': {
      console.log('Checking', action.payload.url);

      return {
        ...state,
        ...initialState,
        checkingForUpdate: true,
      };
    }

    case 'SYSTEM/UPDATE_AVAILABLE': {
      console.log('Available');

      return {
        ...state,
        ...initialState,
        updateAvailable: true,
      };
    }

    case 'SYSTEM/UPDATE_DOWNLOADED': {
      const { releaseNotes, releaseName, releaseDate, updateURL } = action.payload;
      console.log('Downloaded', {releaseNotes, releaseName, releaseDate, updateURL});

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
      console.log('Error', error);

      return {
        ...state,
        ...initialState,
        updateError: action.payload,
      };
    }

    case 'SYSTEM/UPDATE_NOT_AVAILABLE': {
      console.log('Not Available');

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
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return modeled(reducer, 'system')(state, action)
}
