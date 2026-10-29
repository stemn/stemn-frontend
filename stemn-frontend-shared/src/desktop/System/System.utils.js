/* Main process only (called through FunctionLibrary aliases) */
import { readdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { shell } from 'electron'

export { normaliseSlashes } from './normaliseSlashes'

/**
 * Linux AppImages need to be integrated with the desktop (a .desktop entry) for the
 * protocol handler and the launcher icon. Other builds are installed by their installer.
 */
export const getInstallStatus = async () => {
  if (process.platform !== 'linux' || !process.env.APPIMAGE) {
    return true
  }
  const entries = await readdir(join(homedir(), '.local/share/applications')).catch(() => [])
  return entries.some((entry) => /stemn.*\.desktop$/i.test(entry))
}

export const openExternal = ({ url, params }) => {
  const stringParams = params ? new URLSearchParams(params).toString() : ''
  const fullUrl = stringParams ? `${url}?${stringParams}` : url
  if (!/^(https?|mailto):/i.test(fullUrl)) {
    console.error(`Refusing to open ${fullUrl}`)
    return undefined
  }
  return shell.openExternal(fullUrl)
}
