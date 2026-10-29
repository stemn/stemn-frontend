/** Replaces stemn-shared/desktop/System/System.utils.js in the core window */
import { invoke } from '@tauri-apps/api/core'

export { normaliseSlashes } from 'stemn-shared/desktop/System/normaliseSlashes'

export const getInstallStatus = () => invoke<boolean>('install_status')

export const openExternal = ({ url, params }: { url: string; params?: Record<string, string> }) => {
  const stringParams = params ? new URLSearchParams(params).toString() : ''
  const fullUrl = stringParams ? `${url}?${stringParams}` : url
  if (!/^(https?|mailto):/i.test(fullUrl)) {
    console.error(`Refusing to open ${fullUrl}`)
    return undefined
  }
  return invoke('bridge_open_external', { url: fullUrl })
}
