#!/usr/bin/env node
/**
 * `npm run tauri:check`: validates the Tauri config for every platform without building, like
 * the Electron app's `package:check`. Checks tauri.conf.json (and with tauri.release.conf.json
 * merged) against the Tauri CLI's JSON schema, that every bundle target of Linux, Windows and
 * macOS is configured, that the referenced icons / dmg background exist, and the updater /
 * deep-link / CLI plugin settings the Rust code relies on.
 */
import Ajv from 'ajv'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const srcTauri = join(dirname(fileURLToPath(import.meta.url)), '../src-tauri')
const read = (file) => JSON.parse(readFileSync(join(srcTauri, file), 'utf8'))
const schema = JSON.parse(readFileSync(require.resolve('@tauri-apps/cli/config.schema.json'), 'utf8'))

const merge = (base, patch) => {
  if (typeof base !== 'object' || typeof patch !== 'object' || Array.isArray(patch) || !base) return patch
  const out = { ...base }
  for (const [key, value] of Object.entries(patch)) out[key] = merge(base[key], value)
  return out
}

const errors = []
const check = (condition, message) => {
  if (!condition) errors.push(message)
}

const base = read('tauri.conf.json')
const configs = { 'tauri.conf.json': base, '+ tauri.release.conf.json': merge(base, read('tauri.release.conf.json')) }
// The schema (generated from Rust) has patterns like `[^/\:*]` that are invalid with the `u` flag
const regExp = (source, flags) => new RegExp(source, flags.replace('u', ''))
regExp.code = 'new RegExp'
const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true, validateFormats: false, code: { regExp } })
const validate = ajv.compile(schema)
for (const [name, config] of Object.entries(configs)) {
  if (!validate(config)) {
    for (const error of validate.errors) errors.push(`${name}: ${error.instancePath || '/'} ${error.message}`)
  }
}

const { bundle, plugins, app } = base
check(bundle.active && bundle.targets === 'all', 'bundle.targets must be "all" (deb, appimage, nsis, msi, app, dmg)')
for (const icon of bundle.icon) check(existsSync(resolve(srcTauri, icon)), `missing icon ${icon}`)
check(
  bundle.icon.some((i) => i.endsWith('.ico')),
  'Windows needs an .ico icon',
)
check(
  bundle.icon.some((i) => i.endsWith('.icns')),
  'macOS needs an .icns icon',
)
check(bundle.linux?.deb && bundle.linux?.appimage, 'Linux deb and AppImage settings')
check(bundle.windows?.nsis && bundle.windows?.wix, 'Windows NSIS and MSI (WiX) settings')
check(bundle.macOS?.dmg, 'macOS dmg settings')
check(existsSync(resolve(srcTauri, bundle.macOS.dmg.background)), 'missing dmg background')
check(
  read('tauri.release.conf.json').bundle.createUpdaterArtifacts === true,
  'release config must create updater artefacts',
)
check(/^[A-Za-z0-9+/=]{40,}$/.test(plugins.updater.pubkey), 'updater pubkey (minisign, base64)')
check(
  plugins.updater.endpoints.every((url) => url.startsWith('https://')),
  'updater endpoints must be https',
)
check(plugins['deep-link'].desktop.schemes.includes('stemn'), 'stemn:// deep link scheme')
check(
  ['hidden', 'path'].every((name) => plugins.cli.args.some((arg) => arg.name === name)),
  'cli args --hidden and --path',
)
check(app.withGlobalTauri === false, 'withGlobalTauri must stay off (the bridge is the only API)')
for (const capability of app.security.capabilities) {
  check(existsSync(join(srcTauri, 'capabilities', `${capability}.json`)), `missing capability ${capability}`)
}
check(!app.security.capabilities.includes('e2e'), 'the e2e capability must not be enabled by default')

if (errors.length) {
  console.error(`Tauri config check failed:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(
  'Tauri config OK: schema, Linux (deb, AppImage), Windows (NSIS, MSI), macOS (app, dmg), updater, deep link, CLI',
)
