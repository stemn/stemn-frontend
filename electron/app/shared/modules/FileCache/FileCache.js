import { app }              from 'electron';
import mkdirp               from 'mkdirp';
import path                 from 'path';
import fs                   from 'fs';
import http                 from 'axios';
import pify                 from 'pify';
import electronJsonStorage  from 'electron-json-storage';
import { sumBy, values }    from 'lodash';
import { Extract as unzip } from 'unzipper';
const jsonStorage           = pify(electronJsonStorage);
const fsPromise             = pify(fs);

/*******************************************************

This module is used to cache files to in the application
storeage. 'C:\Users\david\AppData\Roaming\STEMN' on
Windows.

The main function is:
FileCache.get({key, url, name, params, responseType})

*******************************************************/

// The maximise size of the file cache
const spaceLimit   = 2 * 1024 * 1024 * 1024; // 2 GB
// Get the app userData folder
const userDataPath = app.getPath('userData');
// Set the path to the files folder
const folderPath   = path.join(userDataPath, 'FileCache');
// Ease the database
let fileCache      = {};
// Get the database
jsonStorage.get('fileCache').then(response => {
  fileCache = response;
});
// Create the folder if it doesn't already exist
mkdirp(folderPath);


/*******************************************************
This will check if a file exists in the cache, if it
does, we return it. Otherwise we download it, save it
and then return it.
*******************************************************/
export const get = ({key, url, name, params, responseType, extract}) => {

  // This will process and return the result based on the 'responseType' indicated
  const processResult = () => {
    console.log('7');
    // Return either the file data or the file path
    // depending on the 'responseType'
    if(responseType == 'path'){
      const filePath = path.join(folderPath, fileCache[key].name);
      console.log({filePath});
      return { data: filePath }
    }
    else{
      return fsPromise.readFile(path.join(folderPath, fileCache[key].name)).then(response => {
        if(responseType == 'json'){
          // Return string
          return {data: response.toString()}
        }
        else{
          // Default: Return ArrayBuffer
          return {data: response}
        }
      })
    }
  }

  // This will get a file from the server and save it to disk
  // and to the fileCache database.
  const getAndSet = () => {

    // This will download and save a file to the file cache
    const downloadAndSave = ({url, dest, onProgress, extract}) => {
      return new Promise((resolve, reject) => {
        http({
          url          : url,
          params       : params,
          responseType : 'stream'
        }).then(response => {
          const stream     = response.data;
          const file       = extract
                             ? unzip({ path : dest })
                             : fs.createWriteStream(dest);
          const total      = response.headers['content-length'];
          let progress     = 0;
          let progressPerc = 0;
          stream.on('data', chunk => {
            progress    += chunk.length;
            progressPerc = parseInt((progress / total) * 100);
            if(onProgress){onProgress(progressPerc)}
          });
          stream.on('error', response => {
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(response)
          });
          stream.on('end', response => {
            resolve({size: total})
          });
          stream.pipe(file)
        })
      })
    };

    // This will rename any svf/png files model.svf and model.png to make them easy to access
    const renameFiles = ({dest}) => {
      return fsPromise.readdir(dest).then(files => {
        // This returns the part folders such as '1', '2' etc
        const renameSvfAndPng = (subFolderPath) => {
          // Read the contents of the subfolder, this will contain the svf and png
          return fsPromise.readdir(subFolderPath).then(files => {
            const filesToRename = files.filter(fileName => fileName.endsWith('.svf') || fileName.endsWith('png'));
            const renameFile = (fileName) => {
              const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
              return fsPromise.rename(`${subFolderPath}/${fileName}`, `${subFolderPath}/model.${extension}`)
            }
            return Promise.all(filesToRename.map(renameFile))
          })
        }
        return Promise.all(files.map(folderName => renameSvfAndPng(`${dest}/${folderName}`)));
      })
    }

    // This will save the file meta into the json store
    // The response from 'downloadAndSave' is passed in here so we have access to the file size
    const saveToJsonStore = (response) => {
      const { size } = response;
      // Save the info to the cache
      fileCache[key] = {
        timestamp : new Date(),
        name      : name,
        size      : size
      }
      // Save the cache (and return the file data)
      return jsonStorage.set('fileCache', fileCache)
    }

    return downloadAndSave({
      url: url,
      dest: path.join(folderPath, name),
      extract: extract
    }).then(response1 => {
      // If extract is true, we rename the files, then save them to the store and process
      if(extract){
        return renameFiles({dest: path.join(folderPath, name)}).then(response2 => saveToJsonStore(response1).then(processResult))
      }
      // Otherwise, we just save to the store and process
      else{
        return saveToJsonStore(response).then(processResult)
      }
    })
  }

  // If we have a cache entry, get the file
  return fileCache[key]
  // If the file is in the json store, get it and process it. If we cannot find it on disk, we getAndSet
  ? fsPromise.stat(path.join(folderPath, fileCache[key].name)).then(processResult).catch(getAndSet)
  // Otherwise, the file does not exist so we getAndSet straight away
  : getAndSet();
}

export const remove = ({key}) => {
  const cacheEntry = fileCache[key];
  if(cacheEntry){
    // Delete the file
    fs.unlink(path.join(folderPath, cacheEntry.name))
    // Delete from the database
    delete fileCache[key];
    // Save the cache
    jsonStorage.set('fileCache', fileCache);
  }
  else{
    console.log('Item could not be found');
  }
}

export const checkSpace = () => {
  const space = sumBy(values(fileCache), (item) => parseInt(item.size));
  if(space >= spaceLimit){
    makeSpace()
  }
}
export const makeSpace = () => {
  // This will delete files in excess
}


//setTimeout(()=>{
//  get({
//    key: '5850dfeda81f36ec5a28ff3e-5850dfed78e6fd11242617d4',
//    url: '/api/v1/sync/render/5850df2378e6fd11242617c7/5850dfeda81f36ec5a28ff3e',
//    name: '5850dfeda81f36ec5a28ff3e-5850dfed78e6fd11242617d4',
//    params: { revisionId: '5850dfed78e6fd11242617d4' },
//    responseType: 'path',
//    extract: true
//  }).then(response => console.log('!!!END!!!', response))
//}, 1000)
