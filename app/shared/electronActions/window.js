import {ipcRenderer} from 'electron';

export const windowMainOpen = () => {
  ipcRenderer.send('electron-action', {
    type: 'WINDOW_MAIN_OPEN'
  })
}
