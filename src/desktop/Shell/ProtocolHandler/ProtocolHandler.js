import winreg from 'winreg';
import { values, every } from 'lodash'

const setRegistryKey = ({hive, key, name, value, type}) => {
  return new Promise((resolve, reject) => {
    const regKey = new winreg({ hive, key });
    regKey.set(name, type, value, err =>
      err == null
      ? resolve()
      : reject(err)
    );
  });
}

const removeRegistryKey = ({hive, key, name}) => {
  return new Promise((resolve, reject) => {
    const regKey = new winreg({ hive, key });
    regKey.remove(name, err =>
      err == null
      ? resolve()
      : reject(err)
    );
  });
}

const getRegistryKey = ({hive, key, name, value}) => {
  return new Promise((resolve, reject) => {
    const regKey = new winreg({ hive, key });
    regKey.get(name, (err, item) =>
      err == null
      ? resolve(item.value == value)
      : reject(err)
    );
  });
}

const getKeys = ({appName, appPath}) => {
  const hive = 'HKCU';
  const type = 'REG_SZ'
  const regKeysObect = {
    name : {
      key: `\\Software\\Classes\\${appName}\\`,
      name: '',
      value:  'URL:Stemn Protocol',
      hive, type
    },
    protocol : {
      key: `\\Software\\Classes\\${appName}\\`,
      name: 'URL Protocol',
      value:  '',
      hive, type
    },
    icon : {
      key: `\\Software\\Classes\\${appName}\\DefaultIcon`,
      name: '',
      value:  `${appPath},0`,
      hive, type
    },
    command : {
      key: `\\Software\\Classes\\${appName}\\shell\\open\\command`,
      name: '',
      value:  `${appPath} "%1"`,
      hive, type
    },
  }
  return values(regKeysObect);
}

export const init = (config) => {
  /*******************************************************
  config: {appName, appPath}
  *******************************************************/
  let regKeys = getKeys(config);

  return {
    isEnabled    : () => { return Promise.all(regKeys.map(getRegistryKey)).then(every)},
    enable       : () => { return Promise.all(regKeys.map(setRegistryKey)) },
    disable      : () => { return Promise.all(regKeys.map(removeRegistryKey)) }
  }
}
