/** Replaces stemn-shared/desktop/ProviderPath/ProviderPath.utils.js (lookups in src-tauri/src/system.rs) */
import { invoke } from '@tauri-apps/api/core'
import { toError } from '../api'

export const getPath = (provider: string) =>
  invoke<string>('provider_path', { provider }).catch((error) => {
    throw toError(error, { code: 'ENOENT' })
  })
