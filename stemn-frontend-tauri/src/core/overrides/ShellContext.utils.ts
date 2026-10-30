/**
 * Replaces stemn-shared/desktop/Shell/ShellContext/ShellContext.utils.js: the Windows explorer
 * context menu entry is written by Rust (src-tauri/src/shell_context.rs, winreg).
 */
import { invoke } from '@tauri-apps/api/core'

let folders: string[] = []

export const updateConfig = (config: { folders?: string[] }) => {
  if (config && Array.isArray(config.folders)) folders = config.folders.filter(Boolean)
}
export const enable = () => invoke<boolean>('shell_context', { action: 'enable', folders })
export const disable = () => invoke<boolean>('shell_context', { action: 'disable', folders })
export const isEnabled = () => invoke<boolean>('shell_context', { action: 'isEnabled', folders })
