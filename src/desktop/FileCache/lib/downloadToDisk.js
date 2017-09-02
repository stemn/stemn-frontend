import { Extract as unzip } from 'unzipper'
import fs                   from 'fs'
import http                 from 'axios'

// This will download and save a file to the dest
export default ({ url, params, dest, onProgress, extract }) => new Promise((resolve, reject) => {
  http({
    url,
    params,
    responseType: 'stream',
  }).then((response) => {
    const stream     = response.data
    const file       = extract
      ? unzip({ path: dest })
      : fs.createWriteStream(dest)
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

    // unzip event uses close, but all others use end
    if (extract) {
      file.on('close', (response) => {
        resolve({
          size: total,
          dest,
        })
      })
    } else {
      stream.on('end', (response) => {
        resolve({
          size: total,
          dest,
        })
      })
    }
    stream.pipe(file)
  }).catch((error) => {
    reject(error.response)
  })
})
