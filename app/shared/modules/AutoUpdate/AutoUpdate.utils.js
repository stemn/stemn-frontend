import { autoUpdater } from 'electron';

export const checkForUpdates = () => {
  autoUpdater.checkForUpdates();
  return autoUpdater.getFeedURL()
}