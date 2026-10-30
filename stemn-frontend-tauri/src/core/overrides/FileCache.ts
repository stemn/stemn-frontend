/**
 * Replaces stemn-shared/desktop/FileCache/FileCache.js in the core window. Downloads, the cache
 * index and the stemn-file:// urls are in Rust (src-tauri/src/cache.rs); same function signatures.
 */
import { invoke } from '@tauri-apps/api/core'
import { apiContext, toError } from '../api'

interface GetInputs {
  key: string
  url: string
  params?: Record<string, unknown>
  name: string
  responseType?: 'json' | 'path' | string
  extract?: boolean
}

/** Resolves with { data }: a stemn-file url ('path'), the file as a string ('json') or its bytes */
export const get = async (inputs: GetInputs) => {
  try {
    const data = await invoke<unknown>('cache_get', { request: inputs, api: apiContext() })
    return { data: Array.isArray(data) ? new Uint8Array(data as number[]) : data }
  } catch (error) {
    throw toError(error)
  }
}

export const downloadToDiskAndSave = (inputs: GetInputs) => get(inputs).then(() => undefined)

/** Electron answered from memory; here it asks Rust (resolves with a boolean) */
export const isCached = ({ key }: { key: string }) => invoke<boolean>('cache_is_cached', { key })

export const remove = ({ key }: { key: string }) => {
  invoke('cache_remove', { key }).catch(() => {})
}

export const makeSpace = () => {}
export const checkSpace = () => {}
