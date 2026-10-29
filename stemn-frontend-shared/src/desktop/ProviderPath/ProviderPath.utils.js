/* Main process only (called through FunctionLibrary aliases) */
import { join } from 'node:path'
import { readFile, readdir } from 'node:fs/promises'
import { homedir, platform as getPlatform } from 'node:os'
import ini from 'ini'
import log from 'electron-log/main'

/**
 * Find the local folder of the Dropbox / Google Drive (legacy Backup and Sync) /
 * OneDrive desktop clients. Stemn maps project files to <provider folder>/<project path>.
 */
const parseWindowsEnvVariable = (path) => path.replace(/%([^%]+)%/g, (_, variable) => process.env[variable])

const dbPaths = {
  drive: {
    darwin: '/Library/Google/Drive/sync_config.db',
    linux: '',
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Google\\Drive\\user_default\\sync_config.db'),
  },
  dropbox: {
    darwin: `${homedir()}/.dropbox/info.json`,
    linux: `${homedir()}/.dropbox/info.json`,
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Dropbox\\info.json'),
  },
  onedrive: {
    darwin: `${homedir()}/Library/Containers/com.microsoft.OneDrive-mac/Data/Library/Application Support/OneDrive/settings/Personal`,
    linux: '',
    win32: parseWindowsEnvVariable('%LOCALAPPDATA%\\Microsoft\\OneDrive\\settings\\Personal'),
  },
}

const notInstalled = (name) => Object.assign(new Error(`${name} not installed locally`), { code: 'ENOENT' })

const readIfExists = async (path, options, name) => {
  if (!path) throw notInstalled(name)
  try {
    return await readFile(path, options)
  } catch (error) {
    throw error.code === 'ENOENT' ? notInstalled(name) : error
  }
}

const paths = {
  drive: async (platform) => {
    const database = await readIfExists(dbPaths.drive[platform], undefined, 'Drive')
    // sql.js (asm.js build, no wasm file to ship) is only loaded when a Drive database exists
    const { default: initSqlJs } = await import('sql.js/dist/sql-asm.js')
    const SQL = await initSqlJs()
    const db = new SQL.Database(database)
    const result = db.exec("SELECT * FROM data WHERE entry_key = 'local_sync_root_path'")
    db.close()
    return result[0].values[0][2].replace('\\\\?\\', '') // drive prefixes path with weird characters sometimes
  },
  dropbox: async (platform) => {
    log.info('Provider Path Dropbox')
    const data = await readIfExists(dbPaths.dropbox[platform], { encoding: 'utf8' }, 'Dropbox')
    const config = JSON.parse(data)
    const account = config.personal || config.business
    return account.path
  },
  onedrive: async (platform) => {
    const dbPath = dbPaths.onedrive[platform]
    if (!dbPath) throw notInstalled('OneDrive')
    const files = await readdir(dbPath).catch(() => [])
    const db = files.find((file) => /[a-f0-9]{16}.ini/.test(file))
    if (!db) throw notInstalled('OneDrive')
    const config = ini.parse(await readFile(join(dbPath, db), { encoding: 'utf16le' }))
    return config.library.split(' ')[7].replace(/"/g, '')
  },
}

export const getPath = (provider) => paths[provider](getPlatform())
