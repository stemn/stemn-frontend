import {ipcRenderer} from 'electron';

export const windowMainOpen = () => {
  ipcRenderer.send('electron-action', {
    type: 'WINDOW_MAIN_OPEN'
  })
}

export const windowMenubarClose = () => {
  ipcRenderer.send('electron-action', {
    type: 'WINDOW_MENUBAR_CLOSE'
  })
}

//export const windowMainClose = () => {
//  ipcRenderer.send('electron-action', {
//    type: 'WINDOW_MAIN_CLOSE'
//  })
//}
