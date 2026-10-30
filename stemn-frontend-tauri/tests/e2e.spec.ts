/**
 * Stemn Desktop on Tauri: the 11 scenarios of stemn-frontend-desktop/tests/e2e.spec.ts against
 * the Tauri shell, over WebDriver (tauri-driver + WebKitWebDriver), with the same outcomes.
 *
 *   npm run test:e2e        (builds the debug e2e app first; E2E_SKIP_BUILD=1 to reuse it)
 *
 * Requires the backend from stemn-backend/local (API :3000, websocket :8000) with the seed data,
 * an X display (DISPLAY, default :1), tauri-driver and WebKitWebDriver. Screenshots go to qa/.
 *
 * Where the Electron suite reaches into the main process (`app.evaluate`), this one uses the
 * test seams of the `e2e` cargo feature: `e2e_windows` (native window state), `e2e_show_menubar`,
 * `e2e_close_previews`, and STEMN_E2E_DIALOG_RESULT, which stands in for the native folder
 * picker (Electron: replacing dialog.showOpenDialog). See src-tauri/src/e2e.rs.
 * About the sync flow see the Electron suite's header: this test plays the storage sync client
 * through the API, everything after that is the app.
 */
import { test, expect } from '@playwright/test'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  api,
  byText,
  click,
  clickText,
  count,
  fill,
  getState,
  goto,
  launchApp,
  screenshot,
  sleep,
  textXPath,
  visible,
} from './helpers'

const EMAIL = 'priya.raman@stemn.local'
const PASSWORD = 'password123'
const PROJECT_NAME = 'CubeSat Deployable Solar Array'
const SYNC_FILE = 'desktop-sync-check.md'

type App = Awaited<ReturnType<typeof launchApp>>

test.describe.serial('Stemn Desktop (Tauri)', () => {
  const userDataDir = mkdtempSync(join(tmpdir(), 'stemn-tauri-e2e-profile-'))
  const syncRoot = mkdtempSync(join(tmpdir(), 'stemn-tauri-e2e-sync-'))
  let app: App
  let token: string
  let commitName: string
  let PROJECT_ID: string

  test.beforeAll(async () => {
    app = await launchApp({ userDataDir, env: { STEMN_E2E_DIALOG_RESULT: syncRoot } })
    await app.win('main')
    const login = await api('POST', '/auth/login', { json: { email: EMAIL, password: PASSWORD } })
    expect(login.status).toBe(200)
    token = login.data.token
    const search = await api('GET', '/search', {
      query: { type: 'project', key: 'name', value: PROJECT_NAME, match: 'regex', size: '10' },
    })
    expect(search.status).toBe(200)
    PROJECT_ID = search.data.find((project: any) => project.name === PROJECT_NAME)._id
  })

  /** Click a file of the project's file list and wait for its preview window (retrying the click
   *  if the list re-rendered under it) */
  const openPreview = async (fileName: string) => {
    const hasPreview = async () =>
      ((await app.invoke('e2e_windows')).value || []).some((w: any) => w.label.startsWith('preview-'))
    await expect(async () => {
      if (!(await hasPreview())) await click(await app.win('main'), `//a//*[text()[normalize-space(.)='${fileName}']]`)
      await expect.poll(hasPreview, { timeout: 5000 }).toBe(true)
    }).toPass({ timeout: 30_000 })
  }

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    // what the main window looked like when a scenario failed
    if (testInfo.status !== testInfo.expectedStatus && app) {
      await screenshot(await app.win('main'), `failure-${testInfo.title.replace(/\W+/g, '-')}`).catch(() => {})
    }
  })

  test.afterAll(async () => {
    await app?.close()
  })

  test('starts with a main window and a tray (menubar) window', async () => {
    // The main window is shown once its page is ready
    await expect
      .poll(async () => {
        const { value } = await app.invoke('e2e_windows')
        return value?.some((w: any) => w.url.includes('/main/index.html') && w.visible)
      })
      .toBe(true)
    const { value: windows } = await app.invoke('e2e_windows')
    // Electron has two BrowserWindows; here the store lives in a third, hidden one (core)
    expect(windows.map((w: any) => w.label)).toEqual(['core', 'main', 'menubar'])
    expect(windows.find((w: any) => w.label === 'main').visible).toBe(true)
    expect(windows.find((w: any) => w.label === 'menubar').url).toContain('/menubar/index.html')
    expect(windows.find((w: any) => w.label === 'core').visible).toBe(false)

    // No node / electron in the renderers: only the bridge, frozen; no eval (CSP)
    const browser = await app.win('main')
    const globals = await browser.execute(() => {
      let evalBlocked = false
      try {
        ;(0, eval)('1')
      } catch {
        evalBlocked = true
      }
      return {
        require: typeof (window as any).require,
        process: typeof (window as any).process,
        bridge: Object.keys((window as any).stemnDesktop || {}).sort(),
        frozen: Object.isFrozen((window as any).stemnDesktop),
        csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        evalBlocked,
      }
    })
    expect(globals.require).toBe('undefined')
    expect(globals.process).toBe('undefined')
    expect(globals.bridge).toEqual([
      'dialog',
      'dispatchToMain',
      'forwardToWindow',
      'getInitialState',
      'log',
      'onAction',
      'platform',
      'shell',
      'versions',
      'window',
    ])
    expect(globals.frozen).toBe(true)
    expect(globals.csp).toBe(true)
    expect(globals.evalBlocked).toBe(true)

    // Capabilities: a renderer window can call the bridge commands, not the core's or the plugins'
    expect((await app.invoke('bridge_window_command', { command: 'isMaximized' })).ok).toBe(true)
    for (const [command, args] of [
      ['cache_get', { request: { key: 'x', url: '/x', name: 'x' }, api: { apiServer: 'http://localhost:3000' } }],
      ['core_broadcast', { payload: {} }],
      ['provider_path', { provider: 'dropbox' }],
      ['plugin:store|load', { path: '/tmp/x.json' }],
      ['plugin:autostart|enable', {}],
      ['plugin:opener|open_url', { url: 'https://stemn.com' }],
    ] as const) {
      const result = await app.invoke(command, args)
      expect(result.ok, command).toBe(false)
      expect(result.error, command).toMatch(/not allowed|denied|not found|permission/i)
    }

    await visible(browser, '[placeholder="Email"]')
    const menubar = await app.win('menubar')
    await expect.poll(() => count(menubar, textXPath('Connect to STEMN'))).toBe(1)
    await screenshot(await app.win('main'), '01-login')
  })

  test('logs in as Priya', async () => {
    const main = await app.win('main')
    await fill(main, '[placeholder="Email"]', EMAIL)
    await fill(main, '[placeholder="Password"]', PASSWORD)
    // Form input is stored in the core store and replayed into the window (an IPC round trip)
    await expect.poll(async () => (await getState(main)).auth.login).toMatchObject({ email: EMAIL, password: PASSWORD })
    const signIn = await main.$$(textXPath('Sign In'))
    await signIn[signIn.length - 1].click()

    await byText(main, 'Priya Raman')
    const state = await getState(main)
    expect(state.auth.user.email || state.auth.user.name).toBeTruthy()
    expect(state.auth.authToken).toBeTruthy()

    // The core store is the source of truth: the token is persisted there (same file and format as Electron)
    await expect
      .poll(() => {
        const file = join(userDataDir, 'storage/state.json')
        return existsSync(file) && !!JSON.parse(readFileSync(file, 'utf8')).auth?.authToken
      })
      .toBe(true)
  })

  test('shows the seeded projects', async () => {
    const main = await app.win('main')
    await byText(main, 'My Projects')
    for (const name of [PROJECT_NAME, 'Hybrid Rocket Engine Test Stand']) {
      await byText(main, name)
    }
    await screenshot(main, '02-projects')
  })

  test('websocket: connected and receiving project events', async () => {
    expect(app.mainLog().some((line) => line.includes('Websocket connected to http://localhost:8000'))).toBe(true)

    // Opening the project joins its websocket room
    const main = await app.win('main')
    await clickText(main, PROJECT_NAME)
    await byText(main, 'Changes')
    await expect
      .poll(async () => {
        const state = await getState(main)
        return Object.values(state.websocket.rooms).some((room: any) => room.room === PROJECT_ID && room.status)
      })
      .toBe(true)

    // A project update by someone else is pushed to the app
    const { data: project } = await api('GET', `/projects/${PROJECT_ID}`, { token })
    await sleep(1500) // the room join is confirmed asynchronously by the websocket server
    const put = await api('PUT', `/projects/${PROJECT_ID}`, { token, json: { blurb: project.blurb } })
    expect(put.status).toBe(200)
    await expect
      .poll(() => app.mainLog().some((line) => line.includes('Websocket received PROJECT/PROJECT_UPDATED')))
      .toBe(true)
    expect(app.mainLog().filter((line) => /websocket error/i.test(line))).toEqual([])
  })

  test('sync: the provider folder is chosen with the native folder picker', async () => {
    // The native dialog is stood in for by STEMN_E2E_DIALOG_RESULT (bridge_select_directory, e2e build)
    const main = await app.win('main')
    await goto(main, '/settings/application')
    await byText(main, 'Cloud Providers')
    await clickText(main, 'Dropbox')
    await byText(main, syncRoot)

    // Reduced by the core store, replayed into the window, and persisted
    expect((await getState(main)).system.providerPath.dropbox).toBe(syncRoot)
    await expect
      .poll(() => JSON.parse(readFileSync(join(userDataDir, 'storage/state.json'), 'utf8')).system.providerPath.dropbox)
      .toBe(syncRoot)
    await screenshot(main, '03-settings-provider-folder')
  })

  test('sync: the project is linked to its cloud folder', async () => {
    const main = await app.win('main')
    await goto(main, `/project/${PROJECT_ID}/settings`)
    await visible(main, `//*[self::h1 or self::h2 or self::h3 or self::h4][normalize-space(.)='Cloud Storage Folder']`)
    const state = await getState(main)
    const remote = state.projects.data[PROJECT_ID].data.remote
    expect(remote.connected).toBe(true)
    expect(remote.provider).toBe('stemn')
    expect(remote.root.path).toBe(PROJECT_NAME)
    await screenshot(main, '04-project-cloud-folder')
  })

  test('sync: a local edit shows up as a change and is committed from the app', async () => {
    // --- play the storage sync client: download the project file into the local folder ---
    const projectFolder = join(syncRoot, PROJECT_NAME)
    mkdirSync(projectFolder, { recursive: true })
    const { data: project } = await api('GET', `/projects/${PROJECT_ID}`, { token })
    const listing = await api('GET', `/sync/listFolder/${PROJECT_ID}`, { token })
    expect(listing.status).toBe(200)
    let file = listing.data.entries.find((entry: any) => entry.name === SYNC_FILE)
    if (!file) {
      const created = await api('POST', `/sync/upload/${PROJECT_ID}`, {
        token,
        query: { name: SYNC_FILE, parentId: project.remote.root._id },
        body: '# Desktop sync check\n\nEdited by the Stemn Desktop end-to-end test.\n',
      })
      expect(created.status).toBe(200)
      file = (await api('GET', `/sync/listFolder/${PROJECT_ID}`, { token })).data.entries.find(
        (entry: any) => entry.name === SYNC_FILE,
      )
    }
    const download = await api('GET', `/sync/download/${PROJECT_ID}/${file.fileId}`, { token })
    expect(download.status).toBe(200)
    const localFile = join(projectFolder, SYNC_FILE)
    writeFileSync(localFile, typeof download.data === 'string' ? download.data : JSON.stringify(download.data))
    expect(readdirSync(projectFolder)).toContain(SYNC_FILE)

    // --- the user edits the file locally ---
    const stamp = new Date().toISOString()
    writeFileSync(
      localFile,
      `${readFileSync(localFile, 'utf8').trimEnd()}\n- ${stamp}: edited on the desktop (Tauri)\n`,
    )

    // --- the sync client uploads the edit as a new revision ---
    const upload = await api('POST', `/sync/upload/${PROJECT_ID}/${file._id}`, { token, body: readFileSync(localFile) })
    expect(upload.status).toBe(200)

    // --- the app detects the change ---
    const main = await app.win('main')
    await goto(main, `/project/${PROJECT_ID}`)
    const changeRow = `//*[contains(@class, "FileChangeRow_fileChangeRow")][.//*[normalize-space(text())='${SYNC_FILE}']]`
    await expect(async () => {
      // Changes list "..." menu -> Refresh
      await click(main, '[title="Filter changes"]', 5000)
      await clickText(main, 'Refresh', { timeout: 5000 })
      await visible(main, changeRow, 3000)
    }).toPass({ timeout: 30_000 })

    // Preview the change (file compare of the new revision)
    await click(main, `${changeRow}//*[normalize-space(text())='${SYNC_FILE}']`)
    await byText(main, `${stamp}: edited on the desktop (Tauri)`, { exact: false })
    await screenshot(main, '05-change-detected')

    // --- commit only this change ---
    await click(main, `${changeRow}//*[@title='Select change']`)
    commitName = `Desktop sync check ${stamp}`
    await fill(main, '[placeholder="Summary"]', commitName)
    await expect.poll(async () => (await getState(main)).changes[PROJECT_ID].name).toBe(commitName)
    // The description is a CodeMirror editor (its placeholder is a separate element)
    await click(
      main,
      `//*[contains(@class, "CodeMirror")][.//*[contains(@class, "CodeMirror-placeholder")][contains(., 'Detailed description')]]`,
    )
    await main.keys('Committed by the Stemn Desktop e2e test (Tauri 2).'.split(''))
    await clickText(main, 'Add Commit')
    await visible(main, `//*[text()[contains(., 'files commited')]]`)
    await screenshot(main, '06-committed')

    // The commit is on the server, with our revision
    await expect
      .poll(async () => {
        const timeline = await api('GET', '/timeline', {
          token,
          query: { entityId: PROJECT_ID, entityType: 'project', 'types[]': 'commits', size: '20' },
        })
        const commit =
          Array.isArray(timeline.data) && timeline.data.find((item: any) => item.data && item.data.name === commitName)
        return commit ? [...new Set(commit.data.items.map((item: any) => item.data.name))] : timeline.status
      })
      .toEqual([SYNC_FILE])

    // ...and in the History tab, which the NEW_COMMITS websocket event refreshes
    await expect
      .poll(() => app.mainLog().some((line) => line.includes('Websocket received PROJECT/NEW_COMMITS')))
      .toBe(true)
    await clickText(main, 'History')
    // The shared code has a race here (Electron too): the History page fetches the commits on mount,
    // and the NEW_COMMITS handler's timeline fetch (issued earlier, dispatched after the 500 ms
    // `fetch-timeline/project` throttle) can land after it with a list from before the commit.
    // Then the list is refreshed from its menu, like a user would (see PARITY.md, known gaps).
    await expect(async () => {
      if (
        !(await byText(main, commitName, { timeout: 3000 }).then(
          () => true,
          () => false,
        ))
      ) {
        // the "..." button next to "Recent Commits"
        await click(
          main,
          `(//*[normalize-space(text())='Recent Commits']/ancestor::*[.//*[name()='svg']][1]//*[name()='svg'])[1]/..`,
          3000,
        )
        await clickText(main, 'Refresh', { timeout: 3000 })
        await byText(main, commitName, { timeout: 3000 })
      }
    }).toPass({ timeout: 30_000 })
    await screenshot(main, '07-history')
  })

  test('preview window: markdown file', async () => {
    const main = await app.win('main')
    await goto(main, `/project/${PROJECT_ID}/files`)
    await byText(main, 'README.md')
    await openPreview('tvac-results.md')
    const preview = await app.win('preview')
    await byText(preview, 'TVAC deployment campaign', { exact: false })
    await byText(preview, 'Meta')
    await screenshot(preview, '08-preview-markdown')

    // The file was downloaded by Rust (the FileCache) into <profile>/FileCache
    expect(readdirSync(join(userDataDir, 'FileCache')).length).toBeGreaterThan(0)
    await app.invoke('e2e_close_previews')
    await expect.poll(async () => (await app.invoke('e2e_windows')).value.length).toBe(3)
  })

  test('preview window: PDF file (served from the cache over stemn-file://)', async () => {
    await openPreview('deployment-analysis.pdf')
    const preview = await app.win('preview')
    await visible(preview, 'canvas', 30_000)
    await expect
      .poll(() =>
        preview.execute(() => {
          const canvas = document.querySelector('canvas')
          return canvas ? canvas.width * canvas.height : 0
        }),
      )
      .toBeGreaterThan(0)
    // pdf.js rendered the page and its (selectable) text layer
    await expect
      .poll(() =>
        count(preview, `//*[contains(@class, "PreviewPdf_textLayer")]//span[contains(., 'Deployment analysis')]`),
      )
      .toBe(1)
    // the document came from the FileCache through the custom protocol (FILES/GET_FILE resolved with its url)
    const state = JSON.stringify(await getState(preview))
    expect(state).toMatch(/"(stemn-file:\/\/cache\/|http:\/\/stemn-file\.localhost\/cache\/)[^"]+"/)
    await sleep(500)
    await screenshot(preview, '09-preview-pdf')
    await app.invoke('e2e_close_previews')
  })

  test('menubar (tray) window shows the active project changes', async () => {
    await app.invoke('e2e_show_menubar')
    const menubar = await app.win('menubar')
    await byText(menubar, 'CubeSat Deployable Solar Arr...')
    await byText(menubar, 'file changes', { exact: false })
    await screenshot(menubar, '10-menubar')

    // Menu actions scoped to the main window are forwarded to it (meta.scope: ['main'])
    await click(menubar, '[title="Options"]')
    await clickText(menubar, 'Preferences')
    await expect.poll(async () => (await app.win('main')).getUrl()).toContain('#/settings/application')
    expect(await (await app.win('menubar')).getUrl()).toMatch(/menubar\/index\.html#\/project\//)
  })

  test('no uncaught exceptions in the core window or the renderers', async () => {
    const errors = app
      .mainLog()
      .filter((line) =>
        /Uncaught exception|\[renderer:\w+\] (Uncaught|Unhandled)|Renderer of the \S+ window is gone|Startup error/.test(
          line,
        ),
      )
    expect(errors).toEqual([])
  })
})
