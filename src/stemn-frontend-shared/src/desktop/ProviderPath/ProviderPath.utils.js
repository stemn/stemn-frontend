import sql            from 'sql.js'
import path           from 'path'
import fs             from 'fs'
import os             from 'os'
import ini            from 'ini'
import { zipObject }  from 'lodash'
import log from 'electron-log'

const parseWindowsEnvVariable = path => path.replace(/%([^%]+)%/g, (_, variable) => process.env[variable])

const dbPaths = {
  drive: {
    darwin: '/Library/Google/Drive/sync_config.db',
    linux: '',
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Google\\Drive\\user_default\\sync_config.db'),
  },
  dropbox: {
    darwin: `${os.homedir()}/.dropbox/info.json`,
    linux: `${os.homedir()}/.dropbox/info.json`,
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Dropbox\\info.json'),
  },
  onedrive: {
    darwin: `${os.homedir()}/Library/Containers/com.microsoft.OneDrive-mac/Data/Library/Application Support/OneDrive/settings/Personal`,
    linux: './',
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Microsoft\\OneDrive\\settings\\Personal'),
  },
}

const paths = {
  drive: (platform, callback) => {
    const dbPath = dbPaths.drive[platform]
    // check the file exists on disk before opening
    return fs.readFile(dbPath, (err, database) => {
      const readDatabase = () => {
        const db = new sql.Database(database)
        const result = db.exec('SELECT * FROM data WHERE entry_key = \'local_sync_root_path\'')
        db.close()
        return result[0].values[0][2].replace('\\\\?\\', '') // drive prefixes path with weird characters sometimes
      }
      return err
        ? callback(err.code === 'ENOENT' ? 'Drive not installed locally' : err)
        : callback(null, readDatabase())
    })
  },
  dropbox: (platform, callback) => {
    log.info('Provider Path Dropbox')
    return fs.readFile(dbPaths.dropbox[platform], { encoding: 'utf8' }, (err, data) => {
      const readDatabase = () => {
        const config = JSON.parse(data)
        const account = config.personal || config.business
        return account.path
      }
      return err
        ? callback(err.code === 'ENOENT' ? 'Dropbox not installed locally' : err)
        : callback(null, readDatabase())
    })
  },
  onedrive: (platform, callback) => {
    const dbPath = dbPaths.onedrive[platform]
    // list the drive folder contents
    return fs.readdir(dbPath, (err, files) => {
      // filter for matching database files
      const db = files.find(file => /[a-f0-9]{16}.ini/.test(file))
      const readDatabase = callback => fs.readFile(path.join(dbPath, db), { encoding: 'utf16le' }, (err, data) => {
        if (err) {
          callback(err)
        } else {
          const config = ini.parse(data)
          const path = config.library.split(' ')[7].replace(/"/g, '')
          callback(null, path)
        }
      })
      return db
        ? readDatabase(callback)
        : callback('OneDrive not installed locally')
    })
  },
}

const platform = os.platform()


export const getPath = provider => new Promise((resolve, reject) => paths[provider](platform, (err, result) => (err
  ? reject(err)
  : resolve(result)),
))

// export const getPaths = (providers) => {
//  return Promise.all(providers.map(getPath)).then(response => zipObject(providers, response))
// }
