import i from 'icepick';
import { create as createPreview } from './windows/preview.js';

const initialState = {
  windows: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ELECTRON_WINDOWS/CREATE':
      return i.updateIn(state, ['windows'], (windows) => {
        return i.push(windows, action.payload);
      })
    case 'ELECTRON_WINDOWS/PARSE':
      parse(state, action);

      return state;
    default:
      return state;
  }
}

////////////////////////////////////

function parse(action){
  console.log(state);
  if(state.windows && state.windows.length > 0){
    state.windows.forEach(window => {
      console.log(window);
      if(window.type == 'PREVIEW'){
        createPreview({uri: `/preview/${window.props.fileId}/${window.props.revisionId}`});
      }
    })
  }
}
