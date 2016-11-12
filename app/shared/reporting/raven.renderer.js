import raven from 'raven-js';
import { version } from '../../package.json';
import { sentryPublic } from '../../config.js'

export default () => {
  raven.config(sentryPublic, {
    release: version,
    environment: process.env.NODE_ENV
  }).install();
}