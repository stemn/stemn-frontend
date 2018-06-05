import winreg from 'winreg'
import { values, every } from 'lodash'

const setRegistryKey = ({ hive, key, name, value, type }) => new Promise((resolve, reject) => {
  const regKey = new winreg({ hive, key })
  regKey.set(name, type, value, err =>
    (err == null
      ? resolve()
      : reject(err)),
  )
})

const removeRegistryKey = ({ hive, key, name }) => new Promise((resolve, reject) => {
  const regKey = new winreg({ hive, key })
  regKey.remove(name, err =>
    (err == null
      ? resolve()
      : reject(err)),
  )
})

const getRegistryKey = ({ hive, key, name, value }) => new Promise((resolve, reject) => {
  const regKey = new winreg({ hive, key })
  regKey.get(name, (err, item) =>
    (err == null
      ? resolve(item.value == value)
      : reject(err)),
  )
})

const getKeys = ({ folders, title, appName, appPath }) => {
  const folderToEnableString = folders.reduce((fullString, path, index) => `${index == 0 ? '' : `${fullString} OR `}(${path})`, '')
  const hive = 'HKCU'
  const type = 'REG_SZ'
  const regKeysObect = {
    folders: {
      key: `\\Software\\Classes\\*\\shell\\${appName}`,
      name: 'AppliesTo',
      value: folderToEnableString,
      hive,
      type,
    },
    icon: {
      key: `\\Software\\Classes\\*\\shell\\${appName}`,
      name: 'Icon',
      value: `${appPath},0`,
      hive,
      type,
    },
    title: {
      key: `\\Software\\Classes\\*\\shell\\${appName}`,
      name: '',
      value: title,
      hive,
      type,
    },
    command: {
      key: `\\Software\\Classes\\*\\shell\\${appName}\\command`,
      name: '',
      value: `${appPath} --path "%1"`,
      hive,
      type,
    },
  }
  return values(regKeysObect)
}

export const init = (config) => {
  /** *****************************************************
  config: {folders, title, appName, appPath}
  ****************************************************** */
  let regKeys = getKeys(config)

  const updateConfig = (newConfig) => {
    const mergedConfig = Object.assign({}, config, newConfig)
    regKeys = getKeys(mergedConfig)
  }

  return {
    updateConfig,
    isEnabled: () => Promise.all(regKeys.map(getRegistryKey)).then(every),
    enable: () => Promise.all(regKeys.map(setRegistryKey)),
    disable: () => Promise.all(regKeys.map(removeRegistryKey)),
  }
}
