#!/usr/bin/env node
/**
 * Validates electron-builder.yml against the electron-builder 26 schema (all
 * platforms) without building, e.g. for the Windows/macOS targets that can't be
 * built on Linux.  Usage: npm run package:check
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getConfig, validateConfiguration } = require('app-builder-lib/out/util/config/config')
const { DebugLogger } = require('builder-util/out/DebugLogger')

const projectDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const config = await getConfig(projectDir, join(projectDir, 'electron-builder.yml'), null)
await validateConfiguration(config, new DebugLogger(false))
console.log(`electron-builder.yml is valid (appId ${config.appId}, productName ${config.productName})`)
console.log(`  win:   ${JSON.stringify(config.win.target)}`)
console.log(`  mac:   ${JSON.stringify(config.mac.target)} (dmg contents: ${config.dmg.contents.length} items)`)
console.log(`  linux: ${JSON.stringify(config.linux.target)}`)
