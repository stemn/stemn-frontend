import fs from 'fs';
import os from 'os';
import pify from 'pify';
import { shell } from 'electron';
import querystring from 'querystring';

export const getInstallStatus = () => {
  if(process.platform == 'linux'){
    return pify(fs.stat)(`${os.homedir()}/.local/share/applications/appimagekit-STEMN.desktop`)
    .then(() => true)
    .catch(() => false);
  }
  // If it is not linux - it must be installed
  else{
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}

export const openExternal = ({url, params}) => {
  const stringParams = querystring.stringify(params);
  shell.openExternal(stringParams ? url+'?'+stringParams : url)
}
