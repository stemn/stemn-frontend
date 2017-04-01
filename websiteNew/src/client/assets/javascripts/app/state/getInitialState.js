import { getStoredState } from 'redux-persist'

export default (persistConfig) => new Promise((resolve, reject) => {
  getStoredState(persistConfig, (err, initialState) => {
    // Return the initialState     
    if (initialState) {
      resolve(initialState)
    } else if (err) {
      reject(err)
    }
  })
});
