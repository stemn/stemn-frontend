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
  url: 'https://raw.githubusercontent.com/MrBlenny/STEMN-Desktop/master/updates.json',
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
    log.info('Update available')
    store.dispatch(updateAvailable());
  });
  updater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    log.info('Update downloaded:', event, releaseNotes, releaseName, releaseDate, updateURL)
    store.dispatch(updateDownloaded(releaseNotes, releaseName, releaseDate, updateURL));
//    updater.quitAndInstall();
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