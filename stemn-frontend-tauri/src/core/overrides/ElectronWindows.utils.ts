/** Replaces stemn-shared/desktop/ElectronWindows/ElectronWindows.utils.js (windows are in src-tauri/src/windows.rs) */
import { invoke } from '@tauri-apps/api/core'

const report = (message: string) => () => console.error(message)

export const create = ({ type, props }: { type: string; props?: Record<string, unknown> }) => {
  if (type === 'PREVIEW') {
    invoke('windows_create_preview', { props: props || {} }).catch(report('Window could not be created'))
  } else {
    console.error('Window could not be created')
  }
}

export const hide = ({ window }: { window: string }) => {
  invoke('windows_hide', { window }).catch(report('Window could not be found'))
}

export const show = ({ window }: { window: string }) => {
  invoke('windows_show', { window }).catch(report('Window could not be found'))
}

export const quit = () => {
  invoke('app_quit')
}

export const relaunch = () => {
  invoke('app_relaunch')
}
