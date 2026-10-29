import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { appImagePath, desktopRoot } from './feed-server'

const run = (args: string[], env: Record<string, string>) => {
  const result = spawnSync(process.execPath, args, {
    cwd: desktopRoot,
    stdio: 'inherit',
    env: { ...(process.env as Record<string, string>), ...env },
  })
  if (result.status !== 0) throw new Error(`${args.join(' ')} failed`)
}

/**
 * Builds (STEMN_ENV=local, so the app never talks to stemn.com) and packages an unsigned AppImage
 * with the release configuration, unless UPDATER_SKIP_PACKAGE=1 and the AppImage exists.
 */
export default async function globalSetup() {
  if (process.platform !== 'linux') throw new Error('The updater integration test packages a Linux AppImage')
  if (process.env.UPDATER_SKIP_PACKAGE && existsSync(appImagePath())) return
  const env: Record<string, string> = { STEMN_ENV: process.env.STEMN_ENV || 'local' }
  run([join(desktopRoot, 'scripts/electron-vite.mjs'), 'build'], env)
  const builder = join(desktopRoot, '../node_modules/electron-builder/cli.js')
  run([builder, '--config', 'electron-builder.config.mjs', '--linux', 'AppImage', '--publish', 'never'], env)
  if (!existsSync(appImagePath())) throw new Error(`electron-builder did not produce ${appImagePath()}`)
}
