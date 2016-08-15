import {ipcRenderer} from 'electron';

export const windowMainOpen = () => {
  console.log('click');
  ipcRenderer.send('electron-action', {
    type: 'WINDOW_MAIN_OPEN'
  })
}
