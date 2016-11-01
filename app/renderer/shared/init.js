import moment from 'moment';
import 'moment/locale/en-gb';
import 'app/renderer/assets/css/app.global.css';
import http from 'axios';

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if((typeof GLOBAL_ENV !== 'undefined')){
  Object.assign(process.env, GLOBAL_ENV);
}

moment.locale('en-gb');
http.defaults.baseURL = `http://${process.env.API_SERVER}/`;

//http.interceptors.response.use(response => response, error => {
//  if(error instanceof Error){
//    error = {
//      errorType: error.toString()
//    }
//  }
//  return Promise.reject(error);
//});
