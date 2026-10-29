/* Main process only (called through FunctionLibrary aliases, see Files/actions/saveFile.desktop.ts) */
import { BrowserWindow, dialog } from 'electron'
import { createWriteStream } from 'node:fs'
import { unlink } from 'node:fs/promises'
import http from 'axios'
import { downloadProgress } from 'stemn-shared/misc/Files/actions/downloadProgress'

const downloadAndSave = ({ fileUrl, dest, onProgress }) =>
  new Promise((resolve, reject) => {
    http({ url: fileUrl, responseType: 'stream' })
      .then((response) => {
        const stream = response.data
        const file = createWriteStream(dest)
        const total = parseInt(response.headers['content-length'], 10)
        let progress = 0
        stream.on('data', (chunk) => {
          progress += chunk.length
          if (total) onProgress((progress / total) * 100)
        })
        stream.on('error', (error) => {
          unlink(dest).catch(() => {})
          reject(error)
        })
        file.on('finish', () => resolve({ size: total || progress }))
        file.on('error', reject)
        stream.pipe(file)
      })
      .catch(reject)
  })

/** Ask where to save `fileUrl` (defaulting to `filePath`) and download it there, reporting progress */
export const save =
  ({ fileUrl, filePath }) =>
  async (dispatch) => {
    const { canceled, filePath: dest } = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      defaultPath: filePath || undefined,
    })
    if (canceled || !dest) return undefined
    dispatch(downloadProgress(fileUrl, 0))
    const result = await downloadAndSave({
      fileUrl,
      dest,
      onProgress: (progress) => dispatch(downloadProgress(fileUrl, progress)),
    })
    dispatch(downloadProgress(fileUrl, 100))
    return result
  }
