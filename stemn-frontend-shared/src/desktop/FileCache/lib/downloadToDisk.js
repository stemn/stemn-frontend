import { createWriteStream } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { Extract as unzip } from 'unzipper'
import http from 'axios'

// This will download and save a file to the dest (or extract a zip into the dest folder)
export default ({ url, params, dest, onProgress, extract }) => new Promise((resolve, reject) => {
  http({
    url,
    params,
    responseType: 'stream',
  }).then((response) => {
    const stream = response.data
    const file = extract
      ? unzip({ path: dest })
      : createWriteStream(dest)
    const total = response.headers['content-length']
    let progress = 0
    stream.on('data', (chunk) => {
      progress += chunk.length
      if (onProgress && total) { onProgress(Math.round((progress / total) * 100)) }
    })
    stream.on('error', (error) => {
      unlink(dest).catch(() => {}) // Delete the partial file
      reject(error)
    })

    const done = () => resolve({ size: total || progress, dest })
    // unzip emits close, write streams emit finish once the data is flushed
    file.on(extract ? 'close' : 'finish', done)
    file.on('error', reject)
    stream.pipe(file)
  }).catch((error) => {
    reject(error.response || error)
  })
})
