import i from 'icepick';

const initialState = {
  windows: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ELECTRON_WINDOWS/CREATE':
      return i.updateIn(state, ['windows'], (windows) => {
        return i.push(windows, action.payload);
      })
    default:
      return state;
  }
}
