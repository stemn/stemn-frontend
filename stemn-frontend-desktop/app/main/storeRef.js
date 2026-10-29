/** Holds the main-process redux store once it has been created (see index.js) */
let store

export const setStore = (newStore) => { store = newStore }
export const getStore = () => store
export const getAuthToken = () => (store ? store.getState().auth.authToken : undefined)
