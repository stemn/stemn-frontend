#!/usr/bin/env node
/**
 * Side-by-side measurements of the Electron and the Tauri builds on this machine (PARITY.md):
 * package sizes, start-up times and memory. Linux + X11 only (xdotool).
 *
 *   node scripts/measure.mjs [--runs 5] [--drop-caches]
 *
 * Expects the release builds: `npm run package` in stemn-frontend-desktop (AppImage +
 * linux-unpacked) and `npm run tauri:build` here (AppImage + deb), both with the same STEMN_ENV
 * and a running backend. Writes qa/measurements.json and qa/measurements.md.
 *
 * Per run, each app starts with a fresh profile (STEMN_USER_DATA_DIR):
 *   first window   launch -> first visible top-level window of the app (the main window, which both
 *                  apps show once its page is ready)
 *   ready          launch -> "Websocket connected to" in the app's main.log (store restored, windows
 *                  created, websocket connected)
 *   idle memory    20 s after ready, summed over the app's whole process tree: RSS (counts shared
 *                  pages once per process) and PSS (shared pages split between processes)
 * The signed-in variant starts with a profile whose state.json holds a session (same file format
 * in both apps) and measures memory with the project list loaded.
 */
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const desktopRoot = join(tauriRoot, '../stemn-frontend-desktop')
const qaDir = join(tauriRoot, 'qa')
const API = process.env.E2E_API_SERVER || 'http://localhost:3000'
const runs = Number(process.argv[process.argv.indexOf('--runs') + 1]) || 5
const dropCaches = process.argv.includes('--drop-caches')
// a temp dir on an exec-able, disk-backed filesystem (profiles are written during the runs)
const scratch = join(homedir(), '.cache/stemn-measure')
mkdirSync(scratch, { recursive: true })

const apps = {
  electron: {
    binary: join(desktopRoot, 'release/linux-unpacked/stemn'),
    installers: [join(desktopRoot, 'release/Stemn-0.0.26-linux-x86_64.AppImage')],
    unpacked: join(desktopRoot, 'release/linux-unpacked'),
  },
  tauri: {
    binary: join(tauriRoot, 'src-tauri/target/release/stemn'),
    installers: [
      join(tauriRoot, 'src-tauri/target/release/bundle/appimage/Stemn_0.0.26_amd64.AppImage'),
      join(tauriRoot, 'src-tauri/target/release/bundle/deb/Stemn_0.0.26_amd64.deb'),
    ],
    unpacked: join(tauriRoot, 'src-tauri/target/release/bundle/appimage/Stemn.AppDir'),
  },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const mb = (bytes) => Math.round((bytes / 1024 / 1024) * 10) / 10
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
const duBytes = (path) => Number(execFileSync('du', ['-sb', path]).toString().split('\t')[0])

const descendants = (pid) => {
  const children = new Map()
  for (const entry of readdirSync('/proc')) {
    if (!/^\d+$/.test(entry)) continue
    try {
      const stat = readFileSync(`/proc/${entry}/stat`, 'utf8')
      const ppid = Number(stat.slice(stat.lastIndexOf(')') + 2).split(' ')[1])
      if (!children.has(ppid)) children.set(ppid, [])
      children.get(ppid).push(Number(entry))
    } catch {
      /* gone */
    }
  }
  const all = []
  const walk = (p) => {
    all.push(p)
    for (const child of children.get(p) || []) walk(child)
  }
  walk(pid)
  return all
}

const memory = (pid) => {
  let rss = 0
  let pss = 0
  const processes = []
  for (const p of descendants(pid)) {
    try {
      const rollup = readFileSync(`/proc/${p}/smaps_rollup`, 'utf8')
      const kb = (name) => Number((rollup.match(new RegExp(`^${name}:\\s+(\\d+)`, 'm')) || [])[1] || 0) * 1024
      const comm = readFileSync(`/proc/${p}/comm`, 'utf8').trim()
      rss += kb('Rss')
      pss += kb('Pss')
      processes.push({ comm, rss: mb(kb('Rss')) })
    } catch {
      /* gone */
    }
  }
  return { rss: mb(rss), pss: mb(pss), processes }
}

const visibleWindows = (pid) => {
  try {
    return execFileSync('xdotool', ['search', '--onlyvisible', '--pid', String(pid)], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean).length
  } catch {
    return 0
  }
}

const login = async () => {
  const response = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya.raman@stemn.local', password: 'password123' }),
  })
  const { token } = await response.json()
  const user = await (await fetch(`${API}/api/v1/me`, { headers: { Authorization: `bearer ${token}` } })).json()
  return { token, user }
}

const runOnce = async (name, { session } = {}) => {
  const profile = mkdtempSync(join(scratch, `${name}-profile-`))
  if (session) {
    mkdirSync(join(profile, 'storage'), { recursive: true })
    writeFileSync(
      join(profile, 'storage/state.json'),
      JSON.stringify({ auth: { authToken: session.token, user: session.user } }),
    )
  }
  if (dropCaches) execFileSync('sudo', ['sh', '-c', 'sync; echo 3 > /proc/sys/vm/drop_caches'])
  const log = join(profile, 'logs/main.log')
  const started = performance.now()
  const env = { ...process.env, DISPLAY: process.env.DISPLAY || ':1', STEMN_USER_DATA_DIR: profile }
  // set by tools that are Electron apps themselves; would start Electron as plain Node
  delete env.ELECTRON_RUN_AS_NODE
  const child = spawn(apps[name].binary, [], {
    env,
    stdio: 'ignore',
    detached: true,
  })
  let firstWindow
  let ready
  while (performance.now() - started < 60_000 && (firstWindow === undefined || ready === undefined)) {
    if (firstWindow === undefined && visibleWindows(child.pid) > 0) firstWindow = performance.now() - started
    if (ready === undefined && existsSync(log) && readFileSync(log, 'utf8').includes('Websocket connected to')) {
      ready = performance.now() - started
    }
    await sleep(10)
  }
  await sleep(session ? 25_000 : 20_000)
  const mem = memory(child.pid)
  process.kill(-child.pid, 'SIGTERM')
  await sleep(1500)
  try {
    process.kill(-child.pid, 'SIGKILL')
  } catch {
    /* exited */
  }
  return { firstWindow: Math.round(firstWindow), ready: Math.round(ready), ...mem }
}

const results = { date: new Date().toISOString(), runs, dropCaches, apps: {} }
const session = await login()
for (const name of Object.keys(apps)) {
  const app = apps[name]
  const installers = Object.fromEntries(app.installers.map((file) => [file.split('/').pop(), mb(statSync(file).size)]))
  const samples = []
  for (let i = 0; i < runs; i += 1) {
    samples.push(await runOnce(name))
    console.log(
      name,
      'run',
      i + 1,
      JSON.stringify(samples.at(-1), (k, v) => (k === 'processes' ? undefined : v)),
    )
  }
  const signedIn = await runOnce(name, { session })
  console.log(name, 'signed in', JSON.stringify(signedIn))
  results.apps[name] = {
    installers,
    unpacked: mb(duBytes(app.unpacked)),
    binary: mb(statSync(app.binary).size),
    firstWindow: median(samples.map((s) => s.firstWindow)),
    ready: median(samples.map((s) => s.ready)),
    idleRss: median(samples.map((s) => s.rss)),
    idlePss: median(samples.map((s) => s.pss)),
    processes: samples.at(-1).processes,
    signedInRss: signedIn.rss,
    signedInPss: signedIn.pss,
    signedInProcesses: signedIn.processes,
    samples,
  }
}

mkdirSync(qaDir, { recursive: true })
writeFileSync(join(qaDir, 'measurements.json'), JSON.stringify(results, null, 2))
const e = results.apps.electron
const t = results.apps.tauri
const rows = [
  [
    'Installer (Linux)',
    `AppImage ${Object.values(e.installers)[0]} MB`,
    Object.entries(t.installers)
      .map(([f, s]) => `${f.split('.').pop() === 'deb' ? 'deb' : 'AppImage'} ${s} MB`)
      .join(', '),
  ],
  ['Unpacked app', `${e.unpacked} MB (linux-unpacked)`, `${t.unpacked} MB (AppImage AppDir, WebKitGTK bundled)`],
  ['Main binary', `${e.binary} MB`, `${t.binary} MB`],
  ['Time to first window (median)', `${e.firstWindow} ms`, `${t.firstWindow} ms`],
  ['Cold start to ready (median)', `${e.ready} ms`, `${t.ready} ms`],
  [
    'Idle memory, signed out (RSS / PSS, all processes)',
    `${e.idleRss} / ${e.idlePss} MB (${e.processes.length} processes)`,
    `${t.idleRss} / ${t.idlePss} MB (${t.processes.length} processes)`,
  ],
  [
    'Idle memory, signed in (RSS / PSS)',
    `${e.signedInRss} / ${e.signedInPss} MB`,
    `${t.signedInRss} / ${t.signedInPss} MB`,
  ],
]
const md = [
  `| Measure | Electron 45 | Tauri 2 |`,
  `| --- | --- | --- |`,
  ...rows.map((row) => `| ${row.join(' | ')} |`),
].join('\n')
writeFileSync(join(qaDir, 'measurements.md'), `${md}\n`)
console.log(md)
