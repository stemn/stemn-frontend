/* Main process only (called through FunctionLibrary aliases) */
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'
import { readFile, stat, unlink } from 'node:fs/promises'
import { promisify } from 'node:util'
import electronJsonStorage from 'electron-json-storage'
import { sumBy, values } from 'lodash'
import { getCacheFolder, toCacheUrl } from 'stemn-frontend-desktop/app/main/protocol.js'

import renameFiles from './lib/renameFiles.js'
import downloadToDisk from './lib/downloadToDisk.js'

/** *****************************************************
This module is used to cache files to in the application
storage: <userData>/FileCache ('C:\Users\david\AppData\Roaming\Stemn\FileCache' on
Windows).

The main function is:
FileCache.get({key, url, name, params, responseType})

responseType 'path' resolves with a `stemn-file://cache/<name>` url that the
renderers can load (see app/main/protocol.js).
****************************************************** */

const jsonStorage = {
  get: promisify(electronJsonStorage.get),
  set: promisify(electronJsonStorage.set),
}

// The maximum size of the file cache
const spaceLimit = 2 * 1024 * 1024 * 1024 // 2 GB
// The folder the files are saved in
const getFolderPath = () => {
  const folderPath = getCacheFolder()
  mkdirSync(folderPath, { recursive: true })
  return folderPath
}

// The cache database
let fileCache = {}
const loaded = jsonStorage
  .get('fileCache')
  .then((response) => {
    fileCache = response || {}
  })
  .catch(() => {
    fileCache = {}
  })

/** *****************************************************
Download to Disk and Save.

This will download a file from the server and write it
to disk. It will also save file details into the
fileCache JSON store.
****************************************************** */
export const downloadToDiskAndSave = ({ key, url, params, name, extract }) => {
  // The response from 'downloadToDisk' is passed in here so we have access to the file size
  const saveToJsonStore = ({ size }) => {
    fileCache[key] = {
      timestamp: new Date(),
      name,
      size,
    }
    return jsonStorage.set('fileCache', fileCache)
  }

  const dest = join(getFolderPath(), name)
  return downloadToDisk({ url, params, dest, extract }).then((response) => {
    // If extract is true, we rename the files, then save them to the store
    if (extract) {
      return renameFiles({ dest }).then(() => saveToJsonStore(response))
    }
    return saveToJsonStore(response)
  })
}

/** *****************************************************
Get file.

This will check if a file exists in the cache, if it
does, we return it. Otherwise we download it, save it
and then return it.
****************************************************** */
export const get = async ({ key, url, params, name, responseType, extract }) => {
  await loaded

  // Return either the file data or the file url depending on the 'responseType'
  const processResult = async () => {
    const fileName = fileCache[key].name
    if (responseType === 'path') {
      return { data: toCacheUrl(fileName) }
    }
    const contents = await readFile(join(getFolderPath(), fileName))
    // 'json' returns the file as a string, anything else as binary data
    return { data: responseType === 'json' ? contents.toString() : contents }
  }

  const getFile = () => downloadToDiskAndSave({ key, url, params, name, extract }).then(processResult)

  // If we have a cache entry, get the file, else download it
  return fileCache[key] ? stat(join(getFolderPath(), fileCache[key].name)).then(processResult, getFile) : getFile()
}

/** This will check if a file is in the cache */
export const isCached = ({ key }) => !!fileCache[key]

export const remove = ({ key }) => {
  const cacheEntry = fileCache[key]
  if (cacheEntry) {
    unlink(join(getFolderPath(), cacheEntry.name)).catch(() => {})
    delete fileCache[key]
    jsonStorage.set('fileCache', fileCache)
  } else {
    console.log('Item could not be found')
  }
}

export const makeSpace = () => {
  // This will delete files in excess
}

export const checkSpace = () => {
  const space = sumBy(values(fileCache), (item) => parseInt(item.size, 10))
  if (space >= spaceLimit) {
    makeSpace()
  }
}
