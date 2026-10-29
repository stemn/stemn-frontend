import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

/** Builds the app for the local backend unless E2E_SKIP_BUILD=1 */
export default async function globalSetup() {
  if (process.env.E2E_SKIP_BUILD) return
  const root = join(__dirname, '..')
  const result = spawnSync(process.execPath, [join(root, 'scripts/electron-vite.mjs'), 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, STEMN_ENV: process.env.STEMN_ENV || 'local' },
  })
  if (result.status !== 0) throw new Error('electron-vite build failed')
}
