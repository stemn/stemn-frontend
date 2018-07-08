import moment from 'moment'
import http from 'axios'
import initRaven from 'stemn-frontend-desktop/app/shared/reporting/raven/raven.renderer.js'
import 'moment/locale/en-gb'
import '../../shared/css/index.global.scss'

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if ((typeof GLOBAL_ENV !== 'undefined')) {
  Object.assign(process.env, GLOBAL_ENV)
}

// Initialise Reporting
initRaven()

moment.locale('en-gb')
http.defaults.baseURL = `${GLOBAL_ENV.API_SERVER}/`
