import http from 'axios';

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if((typeof GLOBAL_ENV !== 'undefined')){
  Object.assign(process.env, GLOBAL_ENV);
}
http.defaults.baseURL = `${process.env.API_SERVER}/`;