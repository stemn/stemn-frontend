#!/usr/bin/env node
/**
 * Runs the electron-vite CLI with a clean environment.
 *
 * ELECTRON_RUN_AS_NODE=1 (set by some tools that are themselves Electron apps,
 * e.g. editor terminals) makes the Electron binary behave like plain Node, so
 * `electron-vite dev|preview` would start a Node process instead of the app.
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// The bin file is not in the package exports: locate it next to package.json
const cli = join(dirname(require.resolve('electron-vite/package.json')), 'bin/electron-vite.js')

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit', env })
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
