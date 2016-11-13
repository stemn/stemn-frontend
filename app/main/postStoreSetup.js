import http from 'axios';
import { ipcMain } from 'electron';
import { getProviderPath } from '../shared/actions/system';


export default (store) => {
  http.interceptors.request.use(config => {
    const token = store.getState().auth.authToken;
    config.headers.Authorization = token ? `bearer ${token}` : ''
    return config;
  });
  
  ipcMain.on('redux-action', (event, action) => {
    store.dispatch(action);
  });
  
  // Dispatch redux initial events
  store.dispatch(getProviderPath());
  

}