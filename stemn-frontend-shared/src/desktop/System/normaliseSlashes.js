import { getPlatform } from 'stemn-shared/desktop/bridge'

// Normalise paths for linux/windows based operating systems
// so they use the right kind of slash
export const normaliseSlashes = (path) =>
  getPlatform() === 'win32' ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/')

export default normaliseSlashes
