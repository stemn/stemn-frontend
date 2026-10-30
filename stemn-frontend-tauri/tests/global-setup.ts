import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * Builds the app for the local backend unless E2E_SKIP_BUILD=1: a debug build with the `e2e`
 * cargo feature and capability (test seams, see src-tauri/src/e2e.rs), not bundled.
 */
export default async function globalSetup() {
  if (process.env.E2E_SKIP_BUILD) return
  const root = join(import.meta.dirname, '..')
  const result = spawnSync(
    'npx',
    [
      'tauri',
      'build',
      '--debug',
      '--no-bundle',
      '--features',
      'e2e',
      '--config',
      JSON.stringify({ app: { security: { capabilities: ['core', 'renderer', 'e2e'] } } }),
    ],
    {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, STEMN_ENV: process.env.STEMN_ENV || 'local', VITE_CONFIG_NATIVE_IGNORE_WARNING: 'true' },
    },
  )
  if (result.status !== 0) throw new Error('tauri build failed')
}
