import { pick } from 'lodash'
import { createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

// Only the auth token and the user are persisted
const authKeysToPersist = ['authToken', 'user']
const persistFn = state => pick(state, authKeysToPersist)

const authTransform = createTransform(persistFn, persistFn, { whitelist: ['auth'] })

// One-off migration: redux-persist v4 stored each key as `reduxPersist:<key>`
const migrateFromV4 = (state) => {
  if (state) return Promise.resolve(state)
  try {
    const legacyAuth = window.localStorage.getItem('reduxPersist:auth')
    if (legacyAuth) {
      return Promise.resolve({
        auth: persistFn(JSON.parse(legacyAuth)),
        _persist: { version: -1, rehydrated: false },
      })
    }
  } catch (err) {
    console.error('Could not migrate persisted auth state', err)
  }
  return Promise.resolve(state)
}

export default {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [authTransform],
  stateReconciler: autoMergeLevel2,
  migrate: migrateFromV4,
}
