import { app }              from 'electron'
import mkdirp               from 'mkdirp'
import path                 from 'path'
import fs                   from 'fs'
import pify                 from 'pify'
import electronJsonStorage  from 'electron-json-storage'
import { sumBy, values }    from 'lodash'
import http                 from 'axios'
const jsonStorage           = pify(electronJsonStorage)
const fsPromise             = pify(fs)

import renameFiles          from './lib/renameFiles.js'
import downloadToDisk       from './lib/downloadToDisk.js'

/** *****************************************************
This module is used to cache files to in the application
storeage. 'C:\Users\david\AppData\Roaming\STEMN' on
Windows.

The main function is:
FileCache.get({key, url, name, params, responseType})
****************************************************** */

// The maximise size of the file cache
const spaceLimit   = 2 * 1024 * 1024 * 1024 // 2 GB
// Get the app userData folder
const userDataPath = app.getPath('userData')
// Set the path to the files folder
const folderPath   = path.join(userDataPath, 'FileCache')
// Ease the database
let fileCache      = {}
// Get the database
jsonStorage.get('fileCache').then((response) => {
  fileCache = response
})
// Create the folder if it doesn't already exist
mkdirp(folderPath)


/** *****************************************************
Download to Disk and Save.

This will download a file from the server and write it
to disk. It will also save file details into the
fileCache JSON store.
****************************************************** */
export const downloadToDiskAndSave = ({ key, url, params, name, extract, onProgressAction }) => {
  // The response from 'downloadToDisk' is passed in here so we have access to the file size
  const saveToJsonStore = ({ size }) => {
    // Save the info to the cache
    fileCache[key] = {
      timestamp: new Date(),
      name,
      size,
    }
    // Save the cache (and return the file data)
    return jsonStorage.set('fileCache', fileCache)
  }

  const dest = path.join(folderPath, name)
  const onProgress = (progressPerc) => {
    //    console.log(onProgressAction, progressPerc);
  }
  return downloadToDisk({ url, params, dest, extract, onProgress }).then((response1) => {
    // If extract is true, we rename the files, then save them to the store
    if (extract) {
      return renameFiles({ dest })
        .then(response2 => saveToJsonStore(response1))
    }
    // Otherwise, we just save to the store
    
    return saveToJsonStore(response1)
  })
}

/** *****************************************************
Get file.

This will check if a file exists in the cache, if it
does, we return it. Otherwise we download it, save it
and then return it.

****************************************************** */
export const get = ({ key, url, params, name, responseType, extract, onProgressAction }) => {
  // This will process and return the result based on the 'responseType' indicated
  const processResult = (response) => {
    // Return either the file data or the file path
    // depending on the 'responseType'
    if (responseType == 'path') {
      const filePath = path.join(folderPath, fileCache[key].name)
      return { data: `file://${filePath}` }
    } 
    return fsPromise.readFile(path.join(folderPath, fileCache[key].name)).then((response) => {
      if (responseType == 'json') {
        // Return string
        return { data: response.toString() }
      } 
      // Default: Return ArrayBuffer
      return { data: response }
    })
  }

  const getFile = () => downloadToDiskAndSave({ key, url, params, name, extract, onProgressAction })
    .then(processResult)

  // If we have a cache entry, get the file
  return fileCache[key]
    ? fsPromise.stat(path.join(folderPath, fileCache[key].name))
      .then(processResult)
      .catch(getFile)
    // Else, we download the file.
    : getFile()
}

/** *****************************************************
This will check if a file is in the cache
****************************************************** */
export const isCached = ({ key }) => !!fileCache[key]

export const remove = ({ key }) => {
  const cacheEntry = fileCache[key]
  if (cacheEntry) {
    // Delete the file
    fs.unlink(path.join(folderPath, cacheEntry.name))
    // Delete from the database
    delete fileCache[key]
    // Save the cache
    jsonStorage.set('fileCache', fileCache)
  } else {
    console.log('Item could not be found')
  }
}

export const checkSpace = () => {
  const space = sumBy(values(fileCache), item => parseInt(item.size))
  if (space >= spaceLimit) {
    makeSpace()
  }
}
export const makeSpace = () => {
  // This will delete files in excess
}


// setTimeout(()=>{
//  get({
//    key: '5850dfeda81f36ec5a28ff3e-5850dfed78e6fd11242617d4',
//    url: '/api/v1/sync/render/5850df2378e6fd11242617c7/5850dfeda81f36ec5a28ff3e',
//    name: '5850dfeda81f36ec5a28ff3e-5850dfed78e6fd11242617d4',
//    params: { revisionId: '5850dfed78e6fd11242617d4' },
//    responseType: 'path',
//    extract: true
//  }).then(response => console.log('!!!END!!!', response))
// }, 1000)
