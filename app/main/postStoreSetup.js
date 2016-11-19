import http from 'axios';
import { ipcMain } from 'electron';
import { getProviderPath } from '../shared/actions/system';
import { enable as enableContext } from '../shared/modules/Shell/ShellContext/ShellContext.actions.js';


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
  store.dispatch(enableContext());
  

}
