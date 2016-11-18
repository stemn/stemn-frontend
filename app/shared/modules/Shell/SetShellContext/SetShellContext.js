import winreg from 'winreg';
import Promise from 'es6-promise';

const setRegistryKey = ({hive, key, name, value, type}) => {
  return new Promise((resolve, reject) => {
    const regKey = new winreg({ hive, key });
    regKey.set(name, type, value, err => 
       err == 'null' 
       ? resolve() 
       : reject(err)
    );
  });
}

const removeRegistryKey = ({hive, key, name}) => {
  return new Promise((resolve, reject) => {
    const regKey = new winreg({ hive, key });
    regKey.remove(name, err => 
       err == 'null' 
       ? resolve() 
       : reject(err)
    );
  });
}

//const getRegistryKey = ({hive, key, name}) => {
//  const regKey = new winreg({ hive, key });
//  return regKey.get(name, function(err, item) {
//    console.log(err, item.value);
//  });
//}

export const enable = (foldersToEnable) => {
  const hive = 'HKCU';
  const folderToEnableString = foldersToEnable.reduce((fullString, path, index) => {
    console.log(index);
    return `${index == 0 ? '' : `${fullString} OR `}(${path})`
  }, '');
  
  const regKeys = [{
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn',
    name: 'AppliesTo',
    value: folderToEnableString,
    type: 'REG_SZ'
  }, {
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn',
    name: 'Icon',
    value: `${process.execPath},0`,
    type: 'REG_SZ'
  }, {
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn',
    name: '',
    value: 'View revisions in Stemn',
    type: 'REG_SZ'
  }, {
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn\\command',
    name: '',
    value: `${process.execPath} "%1"`,
    type: 'REG_SZ'
  }];
  return Promise.all(regKeys.map(setRegistryKey))
}

export const disable = () => {
  const regKeys = [{
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn',
    name: 'AppliesTo',
  }, {
    hive: hive,
    name: 'Icon',
    key: '\\Software\\Classes\\*\\shell\\Stemn',
  }, {
    hive: hive,
    key: '\\Software\\Classes\\*\\shell\\Stemn\\command',
    name: '',
  }];
  return Promise.all(regKeys.map(removeRegistryKey))

}

