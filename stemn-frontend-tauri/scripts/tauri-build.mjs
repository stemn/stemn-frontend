#!/usr/bin/env node
/**
 * `npm run tauri:build`: release build and installers for this OS.
 *
 *   Linux    AppImage + deb        Windows  NSIS + MSI        macOS  .app + dmg
 *
 * Extra arguments go to `tauri build` (e.g. `-- --bundles deb`, `-- --target universal-apple-darwin`).
 * STEMN_ENV defaults to `production` like the Electron build. When TAURI_SIGNING_PRIVATE_KEY is
 * set, the updater artefacts (signed with the minisign key) are produced too
 * (src-tauri/tauri.release.conf.json); without it the build is unsigned, so local and CI builds
 * work with no secrets.
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundles = { linux: 'appimage,deb', win32: 'nsis,msi', darwin: 'app,dmg' }[process.platform]
const args = ['tauri', 'build', ...(bundles ? ['--bundles', bundles] : [])]
if (process.env.TAURI_SIGNING_PRIVATE_KEY) args.push('--config', join(root, 'src-tauri/tauri.release.conf.json'))
args.push(...process.argv.slice(2))

const env = { STEMN_ENV: 'production', VITE_CONFIG_NATIVE_IGNORE_WARNING: 'true', ...process.env }
console.log(`> npx ${args.join(' ')} (STEMN_ENV=${env.STEMN_ENV})`)
const child = spawn('npx', args, { cwd: root, stdio: 'inherit', env, shell: process.platform === 'win32' })
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
