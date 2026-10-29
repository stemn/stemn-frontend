#!/usr/bin/env node
/**
 * Validates the electron-builder configuration (electron-builder.yml + the environment overlay of
 * electron-builder.config.mjs) against the electron-builder 26 schema for all platforms, without
 * building, e.g. for the Windows/macOS targets that can't be built on Linux. Honours the same
 * environment as packaging (STEMN_EDITION, UPDATES_URL, UPDATES_CHANNEL, AZURE_TRUSTED_SIGNING_*).
 *   npm run package:check
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getConfig, validateConfiguration } = require('app-builder-lib/out/util/config/config')
const { DebugLogger } = require('builder-util/out/DebugLogger')

const projectDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const config = await getConfig(projectDir, join(projectDir, 'electron-builder.config.mjs'), null)
await validateConfiguration(config, new DebugLogger(false))
console.log(`electron-builder config is valid (appId ${config.appId}, productName ${config.productName})`)
console.log(`  publish: ${JSON.stringify(config.publish)}`)
console.log(
  `  win:     ${JSON.stringify(config.win.target)} signing: ${config.win.azureSignOptions ? 'azure' : 'none'}`,
)
console.log(`  mac:     ${JSON.stringify(config.mac.target)} (dmg contents: ${config.dmg.contents.length} items)`)
console.log(`  linux:   ${JSON.stringify(config.linux.target)}`)
