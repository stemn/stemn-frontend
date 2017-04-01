import { loadUserData } from 'stemn-shared/misc/Auth/Auth.actions.js';

export default (store) => {
  // Load the user data
  const { auth } = store.getState();
  if ( auth.authToken ) {
    store.dispatch(loadUserData());
  }
}
