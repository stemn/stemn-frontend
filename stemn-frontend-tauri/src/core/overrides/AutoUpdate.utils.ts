/**
 * Replaces stemn-shared/desktop/AutoUpdate/AutoUpdate.utils.js (electron-updater) with
 * tauri-plugin-updater (src-tauri/src/commands.rs `updater_*`). The events have the
 * electron-updater names so AutoUpdate.init reads like the Electron one.
 */
import { invoke } from '@tauri-apps/api/core'
import log from 'electron-log/main'
import { toError } from '../api'

type UpdateInfo = { version: string; currentVersion: string; releaseNotes: string; platform: string }
type Listener = (arg?: any) => void
const listeners = new Map<string, Set<Listener>>()

export const updaterEvents = {
  on: (name: string, listener: Listener) => {
    if (!listeners.has(name)) listeners.set(name, new Set())
    listeners.get(name)!.add(listener)
  },
  emit: (name: string, arg?: unknown) => listeners.get(name)?.forEach((listener) => listener(arg)),
}

const run = async () => {
  try {
    // Development builds and Linux builds other than the AppImage can't update: "up to date"
    if (!(await invoke<boolean>('updater_supported'))) {
      updaterEvents.emit('update-not-available')
      return
    }
    const info = await invoke<UpdateInfo | null>('updater_check')
    if (!info) {
      updaterEvents.emit('update-not-available')
      return
    }
    log.info('Update available:', info.version)
    updaterEvents.emit('update-available', info)
    // autoDownload: true (signature verified against the pubkey in tauri.conf.json)
    await invoke('updater_download')
    updaterEvents.emit('update-downloaded', info)
  } catch (error) {
    updaterEvents.emit('error', toError(error))
  }
}

export const checkForUpdates = () => {
  run()
  return ''
}

export const installUpdates = () => {
  invoke('updater_install').catch((error) => updaterEvents.emit('error', toError(error)))
}
