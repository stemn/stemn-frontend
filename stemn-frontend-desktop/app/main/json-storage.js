import { promisify } from 'node:util'
import electronJsonStorage from 'electron-json-storage'
import { get, set } from 'lodash'

/** Promise versions of electron-json-storage (stored in <userData>/storage/*.json) */
export const jsonStorage = {
  get: promisify(electronJsonStorage.get),
  set: promisify(electronJsonStorage.set),
  clear: promisify(electronJsonStorage.clear),
}

/** *********************************************************
This array of paths determines which redux store data will
be saved in the json-store.

It is an array of path arrays:
  ['auth', 'authToken'] corresponds to store.auth.authToken.
********************************************************* */
export const dataToStoreKeyMap = [
  // Top level stores should not be cached directly because store.hydrated will also save
  ['system', 'settings'],
  ['system', 'installed'],
  ['system', 'providerPath'],
  ['auth', 'authToken'],
  ['auth', 'user'],
  ['sidebar', 'searchString'],
  ['projects', 'activeProject'],
  ['projects', 'data'],
  ['projects', 'userProjects'],
  ['threads', 'boards', '*', 'layout'],
  ['files', 'fileAssemblyParts'], // All assembly-part mappings
  ['files', 'fileAssemblies'], // All part-assembly mappings
  ['files', 'fileMeta'], // All file meta
  ['fileList'], // All folder list queries
]

/** Pick the persisted parts of the store (see dataToStoreKeyMap) */
export const getFilteredStoreData = (data) =>
  dataToStoreKeyMap.reduce((storeObject, keyPath) => {
    const wildCardIndex = keyPath.indexOf('*')
    if (wildCardIndex !== -1) {
      const pathBeforeWildcard = keyPath.slice(0, wildCardIndex)
      const pathAfterWildcard = keyPath.slice(wildCardIndex + 1)
      const wildcardData = get(data, pathBeforeWildcard) || {}
      const dataToSet = {}
      Object.keys(wildcardData).forEach((key) => {
        const pathIncludingWildcard = [key].concat(pathAfterWildcard)
        set(dataToSet, pathIncludingWildcard, get(wildcardData, pathIncludingWildcard))
      })
      return set(storeObject, pathBeforeWildcard, dataToSet)
    }
    const dataToSet = get(data, keyPath)
    return dataToSet === undefined ? storeObject : set(storeObject, keyPath, dataToSet)
  }, {})
