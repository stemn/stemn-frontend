import os from 'os';

import updater from 'electron-simple-updater';
import { version } from '../../../package.json';
import log from 'electron-log';

import {
  currentVersion,
  checkForUpdates,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable
} from './AutoUpdate.actions.js';
  
updater.init({
  url: 'https://raw.githubusercontent.com/Stemn/Stemn-Desktop/master/updates.json',
  checkUpdateOnStart: false,
  version: version,
  logger: {
    info(text) { log.info(text); },
    warn(text) { log.warn(text); }
  }
});

export default function (store) {
  log.info('Current version:', version);
  store.dispatch(currentVersion({version}));

//  if (process.env.NODE_ENV !== 'production') {
//    return;
//  }

  updater.on('update-available', () => {
    store.dispatch(updateAvailable());
  });
  updater.on('update-downloaded', (event) => {
    log.info('Update downloaded:', event)
    store.dispatch(updateDownloaded(event));
  });
  updater.on('error', (error) => {
    log.info('Update Error:', error)
    setTimeout(() => store.dispatch(updateError(error)), 1)
  });
  updater.on('update-not-available', () => {
    store.dispatch(updateNotAvailable());
  });
  
//  store.dispatch(checkForUpdates({url: feedUrl}));
}