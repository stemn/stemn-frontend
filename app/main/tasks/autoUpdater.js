/* eslint-disable max-len */
import os from 'os';
import { autoUpdater } from 'electron';
import pkg from '../../package.json';
import {
  currentVersion,
  checkingForUpdate,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable,
} from '../../shared/actions/system';

export default function (store) {
//  const { version } = pkg;
  const version = '0.0.1';
  store.dispatch(currentVersion({version}));


//  if (process.env.NODE_ENV !== 'production') {
//    return;
//  }

//  if (os.platform() !== 'darwin') {
//    return;
//  }

  autoUpdater.addListener('update-available', () => {
    store.dispatch(updateAvailable());
  });
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    store.dispatch(updateDownloaded(releaseNotes, releaseName, releaseDate, updateURL));
  });
  autoUpdater.addListener('error', (error) => {
    store.dispatch(updateError(error));
  });
  autoUpdater.addListener('update-not-available', () => {
    store.dispatch(updateNotAvailable());
  });

  const platform = os.platform() == 'win32' ? 'win32' : os.platform() + '_' + os.arch();

  const feedUrl = `http://${process.env.UPDATE_SERVER}/update/${platform}/${version}`;
  autoUpdater.setFeedURL(feedUrl);
  store.dispatch(checkingForUpdate({url: feedUrl}));
  autoUpdater.checkForUpdates();

}
