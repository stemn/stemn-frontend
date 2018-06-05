import { get, set } from 'lodash'

/** *********************************************************
This array of paths determines which redux store data will
be saved in the json-store.

It is an array of path arrays:
  ['auth', 'authToken'] corresponds to store.auth.authToken.

/********************************************************* */
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
  ['files', 'fileAssemblyParts'],     // All assembly-part mappings
  ['files', 'fileAssemblies'],        // All part-assembly mappings
  ['files', 'fileMeta'],              // All file meta
  ['fileList'],                       // All folder list queries
]

export const getFilteredStoreData = (data) => {
  // This will filter the store data by the keys map
  // keysMap example: [ ['system'], ['auth', 'authToken'], ['auth', 'user'] ]
  const count = 0
  return dataToStoreKeyMap.reduce((storeObject, keyPath) => {
    const wildCardIndex = keyPath.indexOf('*')
    // If the wildcard exists:
    if (wildCardIndex != -1) {
      const pathBeforeWildcard = keyPath.slice(0, wildCardIndex)
      const pathAfterWildcard  = keyPath.slice(wildCardIndex + 1)
      const wildcardData       = get(data, pathBeforeWildcard)
      const dataToSet          = {}
      Object.keys(wildcardData).forEach((key) => {
        const pathIncludingWildcard = [key].concat(pathAfterWildcard)
        const subDataToSet          = get(wildcardData, pathIncludingWildcard)
        set(dataToSet, pathIncludingWildcard, subDataToSet)
      })
      return set(storeObject, pathBeforeWildcard, dataToSet)
    }
    // Else, there is no wildcard
    
    const dataToSet = get(data, keyPath)
    return set(storeObject, keyPath, dataToSet)
  }, {})
}
