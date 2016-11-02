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
