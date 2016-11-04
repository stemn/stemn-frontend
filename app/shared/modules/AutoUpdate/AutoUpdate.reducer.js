import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState    = {
  currentVersion      : null,
  
  checkingForUpdate   : false,
  updateAvailable     : false,
  updateDownloaded    : false,
  release             : {},
  updateError         : false,
  updateNotAvailable  : false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'AUTO_UPDATE/CURRENT_VERSION': {
      return i.assoc(state, 'currentVersion', action.payload.version)
    }
    case 'AUTO_UPDATE/CHECK_FOR_UPDATES': {
      console.log('Check for updates');
      return i.merge(state, {
        checkingForUpdate   : true,
        updateAvailable     : false,
        updateDownloaded    : false,
        release             : {},
        updateError         : false,
        updateNotAvailable  : false,
      })
    }
    case 'AUTO_UPDATE/UPDATE_AVAILABLE': {
      console.log('Available');
      return i.merge(state, {
        updateAvailable    : true,
        checkingForUpdate  : false,
      })
    }
    case 'AUTO_UPDATE/UPDATE_DOWNLOADED': {
      const { releaseNotes, releaseName, releaseDate, updateURL } = action.payload;
      console.log('Downloaded', {releaseNotes, releaseName, releaseDate, updateURL});
      return i.chain(state)
      .assoc('updateDownloaded', true)
      .assoc('release', {
        releaseNotes,
        releaseName,
        releaseDate,
        updateURL,
      })
      .value();
    }
    case 'AUTO_UPDATE/UPDATE_ERROR': {
      console.log('error:', action.payload);
      return i.merge(state, {
        updateError        : action.payload,
        checkingForUpdate  : false,
      })
    }
    case 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE': {
      console.log('Not available');
      return i.merge(state, {
        updateNotAvailable : true,
        checkingForUpdate  : false,
      })
    }
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return modeled(reducer, 'autoUpdate')(state, action)
}
