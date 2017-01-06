import configureStore from './configureStore.js';
const store = configureStore();
store.dispatch({
  type: 'SOME_TEST_ACTION'
})
export default store;
