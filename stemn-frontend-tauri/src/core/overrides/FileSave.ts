/**
 * Replaces stemn-shared/desktop/FileSave/FileSave.js in the core window: the save dialog and the
 * download are in Rust (`save_file`); progress arrives as `stemn:download-progress` events, which
 * the core turns into downloadProgress actions (see core/index.ts).
 */
import { invoke } from '@tauri-apps/api/core'
import { apiContext, toError } from '../api'

export const save =
  ({ fileUrl, filePath }: { fileUrl: string; filePath?: string }) =>
  async () => {
    try {
      const result = await invoke<{ size: number } | null>('save_file', {
        fileUrl,
        filePath: filePath || null,
        api: apiContext(),
      })
      return result || undefined
    } catch (error) {
      throw toError(error)
    }
  }
