import fs from 'fs'
import os from 'os'
import pify from 'pify'
import { shell } from 'electron'
import querystring from 'querystring'
import process from 'process'

export const getInstallStatus = () => {
  if (process.platform == 'linux') {
    return pify(fs.stat)(`${os.homedir()}/.local/share/applications/appimagekit-stemn.desktop`)
      .then(() => true)
      .catch(() => false)
  }
  // If it is not linux - it must be installed
  
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

export const openExternal = ({ url, params }) => {
  const stringParams = querystring.stringify(params)
  shell.openExternal(stringParams ? `${url}?${stringParams}` : url)
}

// Normalise paths for linux/windows bases operating systems
// so they use the right kind of slash
export const normaliseSlashes = path => (process.platform === 'win32'
  ? path.replace(/\//g, '\\')
  : path.replace(/\\/g, '/'))

