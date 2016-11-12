import http from 'axios';
import initElectronCrash from '../shared/reporting/electron-crash.js';
import initRaven from '../shared/reporting/raven.main.js';

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if((typeof GLOBAL_ENV !== 'undefined')){
  Object.assign(process.env, GLOBAL_ENV);
}

// Initialise Reporting
initElectronCrash();
initRaven();

http.defaults.baseURL = `${process.env.API_SERVER}/`;