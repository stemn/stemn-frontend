import http from 'axios'
import { remote } from 'electron'
import * as fs from 'fs'
import { noop } from 'lodash'
import { downloadProgress } from './downloadProgress'
import { getFullPath } from './getFullPath.desktop'

export interface IActionSaveFileInput {
  fileUrl: string,
  filePath: string,
  onProgress: (percentage: number) => void
}

const downloadAndSave = (
  { fileUrl, dest, onProgress }:
  { fileUrl: string, dest: string, onProgress: (percentage: number) => void },
  ) => new Promise((resolve, reject) => {
  http({
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => {
    const stream = response.data
    const file = fs.createWriteStream(dest)
    const total = parseInt(response.headers['content-length'], 10)
    let progress = 0
    let progressPerc = 0
    stream.on('data', (chunk) => {
      progress += chunk.length
      progressPerc = (progress / total) * 100
      if (onProgress) { onProgress(progressPerc) }
    })
    stream.on('error', (errorResponse) => {
      fs.unlink(dest, noop) // Delete the file async. (But we don't check the result)
      reject(errorResponse)
    })
    stream.on('end', () => {
      resolve({ size: total })
    })
    stream.pipe(file)
  }).catch((error) => reject(error))
})

const startSave = ({ fileUrl, filePath, onProgress }: IActionSaveFileInput) => {
  const getDestination = (defaultPath): Promise<string> => new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      defaultPath,
    }, (file) => {
      if (file) { resolve(file) } else { reject(false) }
    })
  })

  return getDestination(filePath)
    .then((dest) => downloadAndSave({ fileUrl, dest, onProgress }))
    .catch((error) => error)
}

export const saveFile = ({ file, fileUrl }) => (dispatch, getState) =>
  // First, we get the existing path of the file so we can direct the file save
  // dialog to this location
  dispatch(getFullPath({
    path: file.path,
    projectId: file.project._id,
    provider: file.provider,
  })).then((filePath) => {
    // Set progress to zero
    dispatch(downloadProgress(fileUrl, 0))
    // Start the save process
    return startSave({
      fileUrl,
      filePath,
      onProgress: (progress) => {
        dispatch(downloadProgress(fileUrl, progress))
      },
    })
  })
