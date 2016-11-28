import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  installed: false,
  providerPath: {
    dropbox: null,
    drive: null,
    onedrive: null,
  },
  settings: {
    usageData: true
  },
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
    case 'SYSTEM/GET_INSTALL_STATUS_FULFILLED': {
      return i.assoc(state, 'installed', action.payload)
    }
    case 'SYSTEM/GET_INSTALL_STATUS_REJECTED': {
      return i.assoc(state, 'installed', action.payload)
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
