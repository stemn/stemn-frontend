import { get, set } from 'lodash';

/***********************************************************
This array of paths determines which redux store data will
be saved in the json-store.

It is an array of path arrays:
  ['auth', 'authToken'] corresponds to store.auth.authToken.

/**********************************************************/
export const dataToStoreKeyMap = [
  ['system'],
  ['auth', 'authToken'],
  ['auth', 'user'],
  ['sidebar', 'searchString']
];

export const getFilteredStoreData = (data) => {
  // This will filter the store data by the keys map
  // keysMap example: [ ['system'], ['auth', 'authToken'], ['auth', 'user'] ]
  return dataToStoreKeyMap.reduce((storeObject, keyPath) => set(storeObject, keyPath, get(data, keyPath)), {})
}
