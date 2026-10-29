/**
 * `electron-json-storage` (callback API: get / set / clear) on tauri-plugin-store, for the reused
 * stemn-frontend-desktop/app/main/json-storage.js. Each key is one store file,
 * `<profile>/storage/<key>.json`, whose top-level entries are the stored object's keys. So the
 * file content is exactly the object, as electron-json-storage writes it: the Electron app's
 * `state.json` is read as is (and the e2e tests read ours the same way).
 */
import { load, type Store } from '@tauri-apps/plugin-store'

type Callback<T> = (error: unknown, data?: T) => void

let storageDir: string | undefined
const stores = new Map<string, Promise<Store>>()

export const setStorageDir = (dir: string) => {
  storageDir = dir
}

const storeFor = (key: string) => {
  if (!storageDir) return Promise.reject(new Error('The storage folder is not set'))
  const path = `${storageDir}/${key}.json`
  if (!stores.has(path)) stores.set(path, load(path, { autoSave: false, defaults: {} }))
  return stores.get(path)!
}

// writes of one key are serialised (clear + set + save must not interleave)
const queues = new Map<string, Promise<unknown>>()
const enqueue = <T>(key: string, task: () => Promise<T>) => {
  const run = (queues.get(key) || Promise.resolve()).catch(() => {}).then(task)
  queues.set(key, run)
  return run
}

export const get = (key: string, callback: Callback<Record<string, unknown>>) => {
  enqueue(key, async () => Object.fromEntries(await (await storeFor(key)).entries()))
    .then((data) => callback(null, data))
    .catch((error) => callback(error))
}

export const set = (key: string, value: Record<string, unknown>, callback: Callback<void>) => {
  enqueue(key, async () => {
    const store = await storeFor(key)
    await store.clear()
    for (const [name, item] of Object.entries(value || {})) await store.set(name, item)
    await store.save()
  })
    .then(() => callback(null))
    .catch((error) => callback(error))
}

/** electron-json-storage deletes every key; the core only ever stores `state` */
export const clear = (callback: Callback<void>) => {
  enqueue('state', async () => {
    const store = await storeFor('state')
    await store.clear()
    await store.save()
  })
    .then(() => callback(null))
    .catch((error) => callback(error))
}

export default { get, set, clear, setStorageDir }
