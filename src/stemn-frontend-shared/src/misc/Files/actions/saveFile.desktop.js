import { remote } from 'electron'
import http from 'axios'
import fs from 'fs'
import downloadProgress from './downloadProgress'
import getFullPath from './getFullPath.desktop'

const saveFile = ({ fileUrl, filePath, onProgress }) => {
  const getDestination = defaultPath => new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      defaultPath,
    }, (file) => {
      if (file) { resolve(file) } else { reject(false) }
    })
  })

  const downloadAndSave = ({ fileUrl, dest, onProgress }) => new Promise((resolve, reject) => {
    http({
      url: fileUrl,
      responseType: 'stream',
    }).then((response) => {
      const stream     = response.data
      const file       = fs.createWriteStream(dest)
      const total      = response.headers['content-length']
      let progress     = 0
      let progressPerc = 0
      stream.on('data', (chunk) => {
        progress    += chunk.length
        progressPerc = parseInt((progress / total) * 100)
        if (onProgress) { onProgress(progressPerc) }
      })
      stream.on('error', (response) => {
        fs.unlink(dest) // Delete the file async. (But we don't check the result)
        reject(response)
      })
      stream.on('end', (response) => {
        resolve({ size: total })
      })
      stream.pipe(file)
    })
  })

  return getDestination(filePath)
    .then(dest => downloadAndSave({ fileUrl, dest, onProgress }))
    .catch(error => error)
}


export default ({ file, fileUrl }) => (dispatch, getState) => 
  // First, we get the existing path of the file so we can direct the file save
  // dialog to this location
  dispatch(getFullPath({
    path: file.path,
    projectId: file.project._id,
    provider: file.provider,
  })).then((filePath) => {
    // Set progress to zero
    dispatch(downloadProgress(fileUrl, 0))
    // Start the save provess
    saveFile({
      fileUrl,
      filePath,
      onProgress: (progress) => {
        dispatch(downloadProgress(fileUrl, progress))
      },
    })
  })

