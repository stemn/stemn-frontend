const Promise = require('bluebird');
const sql = require('sql.js');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const os = require('os');
const ini = require('ini');

const parseWindowsEnvVariable = (path) => path.replace(/%([^%]+)%/g, (_, variable) => process.env[variable]);

const dbPaths = {
    drive : {
        darwin : '/Library/Google/Drive/sync_config.db',
        linux : '',
        win32 : parseWindowsEnvVariable('%LOCALAPPDATA%\\Google\\Drive\\user_default\\sync_config.db')
    },
    dropbox : {
        darwin : `${os.homedir()}/.dropbox/info.json`,
        linux : `${os.homedir()}/.dropbox/info.json`,
        win32 : parseWindowsEnvVariable('%LOCALAPPDATA%\\Dropbox\\info.json'),
    },
    onedrive : {
        darwin : `${os.homedir()}/Library/Containers/com.microsoft.OneDrive-mac/Data/Library/Application Support/OneDrive/settings/Personal`,
        linux : './',
        win32 : parseWindowsEnvVariable('%LOCALAPPDATA%\\Microsoft\\OneDrive\\settings\\Personal')
    }
}

const paths = {
    drive : (platform) => {
        const dbPath = dbPaths.drive[platform];

        // check the file exists on disk before opening
        return fs.readFileAsync(dbPath).then((database) => {
            const db = new sql.Database(database);
            const result = db.exec(`SELECT * FROM data WHERE entry_key = 'local_sync_root_path'`);
            db.close();
            return result[0].values[0][2].replace('\\\\?\\', ''); // drive prefixes path with weird characters sometimes
        }).catch((err) => err.code === 'ENOENT'
            ? `Drive not installed locally`
            : Promise.reject(err)
        );
    },
    dropbox : (platform) => {
        return fs.readFileAsync(dbPaths.dropbox[platform], { encoding : 'utf8' }).then((data) => {
            const config = JSON.parse(data);
            const account = config.personal || config.business;
            return account.path;
        }).catch((err) => err.code === 'ENOENT'
            ? `Dropbox not installed locally`
            : Promise.reject(err)
        );
    },
    onedrive : (platform) => {
        const dbPath = dbPaths.onedrive[platform];
        // list the drive folder contents
        return fs.readdirAsync(dbPath).then((files) => {
            // filter for matching database files
            const db = files.find((file) => /[a-f0-9]{16}.ini/.test(file));
            return db
                ? fs.readFileAsync(path.join(dbPath, db), { encoding : 'utf16le' }).then((data) => {
                    const config = ini.parse(data);
                    const path = config.library.split(' ')[7].replace(/"/g, '');
                    return path;
                })
                : `OneDrive not installed locally`;
        });
    }
}

const platform = os.platform();

export default (provider) => {
  return paths[provider](platform).then((path) => {
    return path
  });
}
