import { app }              from 'electron';
import mkdirp               from 'mkdirp';
import path                 from 'path';
import fs                   from 'fs';
import http                 from 'http';
import pify                 from 'pify';
import electronJsonStorage  from 'electron-json-storage';
const jsonStorage = pify(electronJsonStorage);
const fsPromise   = pify(fs);

// Here we do some initial setup
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

const downloadAndSave = ({url, dest, onProgress}) => {
  return new Promise((resolve, reject) => {
    http.get(url, (request) => {
      const file       = fs.createWriteStream(dest);
      const total      = request.headers['content-length'];
      let progress     = 0;
      let progressPerc = 0;
      request.on('data', function (chunk) {
        progress    += chunk.length;
        progressPerc = parseInt((progress / total) * 100);
        if(onProgress){onProgress(progressPerc)}
      });
      request.pipe(file);
      file.on('finish', (response) => {
        resolve({
          size: total
        })
      });
    }).on('error', (response) => {
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(response)
    });
  })
};

/*******************************************************
This will check if a file exists in the cache, if it
does, we return it. Otherwise we download it, save it
and then return it.
*******************************************************/
export const get = ({key, url, name, returnPath}) => {
  const cacheEntry = fileCache[key];

  const processResult = () => {
    // Return either the file data or the file path
    // depending on the status of 'returnPath'
    return returnPath
    ? path.join(folderPath, cacheEntry.name)
    : fsPromise.readFile(path.join(folderPath, cacheEntry.name))
  }

  // This will get a file from the server and save it
  // to disk and to the fileCache database.
  const getAndSet = () => {
    return downloadAndSave({
      url: url,
      dest: path.join(folderPath, name)
    }).then(response => {
      const { size } = response;
      // Save the info to the cache
      fileCache[key] = {
        timestamp : new Date(),
        name      : name,
        size      : size
      }
      // Save the cache (and return the file data)
      return jsonStorage.set('fileCache', fileCache).then(processResult);
    })
  }

  // If we have a cache entry, get the file
  return cacheEntry
  ? fsPromise.stat(path.join(folderPath, cacheEntry.name)).then(processResult).catch(getAndSet)
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

setTimeout(()=>{
  get({
    url        : 'http://developer-autodesk.github.io/translated-models/shaver/0.svf',
    key        : 'some-file1',
    name       : 'some-file1.svf'
  }).then(response => {
    console.log({response});
  })
  get({
    url        : 'http://developer-autodesk.github.io/translated-models/shaver/0.svf',
    key        : 'some-file2',
    name       : 'some-file2.svf',
    returnPath : true,
  }).then(response => {
    console.log({response});
  })
}, 1000)
