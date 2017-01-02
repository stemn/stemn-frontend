import i from 'icepick';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'TOGGLE_PANEL/TOGGLE':
      return i.assoc(state, action.payload.cacheKey, action.payload.value)
    default:
      return state
  }
}