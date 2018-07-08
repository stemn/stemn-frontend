import { crashReporter } from 'electron'
import { version } from '../../../package.json'

export default () => {
  crashReporter.start({
    companyName: 'Stemn',
    productName: 'Stemn Desktop',
    submitURL: GLOBAL_ENV.ELECTRON_CRASH_REPORT_SERVER,
    uploadToServer: true,
    extra: {
      app_version: version,
      electron_context: process.type, // 'renderer' || 'browser'
    },
  })
}
