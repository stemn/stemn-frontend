import raven from 'raven'
import { dialog } from 'electron'
import { version } from '../../../package.json'
import { sentryPrivate } from '../../../config.js'

export default () => {
  const client = new raven.Client(sentryPrivate, {
    release: version,
    environment: process.env.NODE_ENV,
  })
  process.on('uncaughtException', (error) => {
    client.captureException(error)
    console.error(error)
    dialog.showErrorBox('An error occured in the main thread', `${error.toString()} \rThis error has been sent to Stemn for analysis.`)
  })
}
