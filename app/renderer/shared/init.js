import moment from 'moment';
import 'moment/locale/en-gb';
import 'app/renderer/assets/css/app.global.css';
import http from 'axios';
import initElectronCrash from 'app/shared/reporting/electron-crash.js';
import initRaven from 'app/shared/reporting/raven.renderer.js';

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if((typeof GLOBAL_ENV !== 'undefined')){
  Object.assign(process.env, GLOBAL_ENV);
}

// Initialise Reporting
initElectronCrash();
initRaven();

moment.locale('en-gb');
http.defaults.baseURL = `${process.env.API_SERVER}/`;