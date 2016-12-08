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
    usageData: true,
    autoUpdate: true,
    debug: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SYSTEM/GET_PROVIDER_PATH_FULFILLED': {
      let chain = i.chain(state)
      if(action.payload.dropbox){
        chain = chain.assocIn(['providerPath', 'dropbox'], action.payload.dropbox)
      }      
      if(action.payload.dropbox){
        chain = chain.assocIn(['providerPath', 'drive'], action.payload.drive)
      }
      return chain.value();
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
    state = i.chain(initialState).merge(state).assoc('hydrated', true).value();
  }
  return modeled(reducer, 'system')(state, action)
}
