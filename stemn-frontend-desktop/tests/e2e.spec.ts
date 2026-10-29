/**
 * Stemn Desktop end-to-end test (Electron 45 + the local Stemn backend).
 *
 *   npm run test:e2e        (builds with STEMN_ENV=local first; E2E_SKIP_BUILD=1 to reuse dist/)
 *
 * Requires the backend from stemn-backend/local (API :3000, websocket :8000) with the
 * seed data, and an X display (DISPLAY, default :1). Screenshots go to qa/.
 *
 * About the sync flow: Stemn Desktop does not copy files itself. A project is linked
 * to a cloud storage folder (Dropbox / Google Drive, or the built-in `stemn` storage the
 * seed data uses); the provider's own sync client moves the files between that folder
 * and the cloud, and the backend turns the provider's changes into "changes" that the
 * desktop app lists, previews, and commits. Dropbox/Drive need real OAuth accounts, so
 * this test plays the sync client through the API (download the file into a local
 * folder, edit it, upload the edit as a new revision) and checks everything the app
 * does: the provider folder setting (native folder picker), change detection, the
 * file compare preview, the commit, the history, the websocket events and the
 * FileCache download used by the preview window.
 */
import { test, expect, Page } from '@playwright/test'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { api, getState, goto, launchApp, LaunchedApp, screenshot } from './helpers'

const EMAIL = 'priya.raman@stemn.local'
const PASSWORD = 'password123'
const PROJECT_ID = '6ae28ca000a6d67ef108181f'
const PROJECT_NAME = 'CubeSat Deployable Solar Array'
const SYNC_FILE = 'desktop-sync-check.md'

test.describe.serial('Stemn Desktop', () => {
  const userDataDir = mkdtempSync(join(tmpdir(), 'stemn-desktop-e2e-profile-'))
  const syncRoot = mkdtempSync(join(tmpdir(), 'stemn-desktop-e2e-sync-'))
  let launched: LaunchedApp
  let main: Page
  let token: string
  let commitName: string

  test.beforeAll(async () => {
    launched = await launchApp({ userDataDir })
    main = await launched.getWindow('main')
    const login = await api('POST', '/auth/login', { json: { email: EMAIL, password: PASSWORD } })
    expect(login.status).toBe(200)
    token = login.data.token
  })

  test.afterAll(async () => {
    await launched?.app.close()
  })

  test('starts with a main window and a tray (menubar) window', async () => {
    const { app, getWindow } = launched
    const menubar = await getWindow('menubar')

    const windows = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().map((win) => {
      const preferences = (win.webContents as any).getLastWebPreferences()
      return {
        url: win.webContents.getURL(),
        visible: win.isVisible(),
        webPreferences: {
          contextIsolation: preferences.contextIsolation,
          nodeIntegration: preferences.nodeIntegration,
          sandbox: preferences.sandbox,
        },
      }
    }))
    expect(windows).toHaveLength(2)
    expect(windows.find(w => w.url.includes('/main/index.html'))!.visible).toBe(true)
    expect(windows.find(w => w.url.includes('/menubar/index.html'))).toBeTruthy()
    for (const win of windows) {
      expect(win.webPreferences).toEqual({ contextIsolation: true, nodeIntegration: false, sandbox: true })
    }

    // No node / electron in the renderers: only the preload bridge
    const globals = await main.evaluate(() => ({
      require: typeof (window as any).require,
      process: typeof (window as any).process,
      bridge: Object.keys((window as any).stemnDesktop || {}).sort(),
    }))
    expect(globals.require).toBe('undefined')
    expect(globals.process).toBe('undefined')
    expect(globals.bridge).toEqual(['dialog', 'dispatchToMain', 'forwardToWindow', 'getInitialState', 'log', 'onAction', 'platform', 'shell', 'versions', 'window'])

    await expect(main.getByPlaceholder('Email')).toBeVisible()
    await expect(menubar.locator('text=Connect to STEMN')).toHaveCount(1)
    await screenshot(main, '01-login')
  })

  test('logs in as Priya', async () => {
    await main.getByPlaceholder('Email').fill(EMAIL)
    await main.getByPlaceholder('Password').fill(PASSWORD)
    // Form input is stored in the main-process store and replayed into the window (an IPC round trip)
    await expect.poll(async () => (await getState(main)).auth.login).toMatchObject({ email: EMAIL, password: PASSWORD })
    await main.getByText('Sign In', { exact: true }).last().click()

    await expect(main.getByText('Priya Raman')).toBeVisible()
    const state = await getState(main)
    expect(state.auth.user.email || state.auth.user.name).toBeTruthy()
    expect(state.auth.authToken).toBeTruthy()

    // The main-process store is the source of truth: the token is persisted there
    await expect.poll(() => {
      const file = join(userDataDir, 'storage/state.json')
      return existsSync(file) && !!JSON.parse(readFileSync(file, 'utf8')).auth.authToken
    }).toBe(true)
  })

  test('shows the seeded projects', async () => {
    await expect(main.getByText('My Projects')).toBeVisible()
    for (const name of [PROJECT_NAME, 'Hybrid Rocket Engine Test Stand']) {
      await expect(main.getByText(name, { exact: true }).first()).toBeVisible()
    }
    await screenshot(main, '02-projects')
  })

  test('websocket: connected and receiving project events', async () => {
    const { mainLog } = launched
    expect(mainLog().some(line => line.includes('Websocket connected to http://localhost:8000'))).toBe(true)

    // Opening the project joins its websocket room
    await main.getByText(PROJECT_NAME, { exact: true }).first().click()
    await expect(main.getByText('Changes', { exact: true })).toBeVisible()
    await expect.poll(async () => {
      const state = await getState(main)
      return Object.values(state.websocket.rooms).some((room: any) => room.room === PROJECT_ID && room.status)
    }).toBe(true)

    // A project update by someone else is pushed to the app
    const { data: project } = await api('GET', `/projects/${PROJECT_ID}`, { token })
    await main.waitForTimeout(1500) // the room join is confirmed asynchronously by the websocket server
    const put = await api('PUT', `/projects/${PROJECT_ID}`, { token, json: { blurb: project.blurb } })
    expect(put.status).toBe(200)
    await expect.poll(() => mainLog().some(line => line.includes('Websocket received PROJECT/PROJECT_UPDATED'))).toBe(true)
    expect(mainLog().filter(line => /websocket error/i.test(line))).toEqual([])
  })

  test('sync: the provider folder is chosen with the native folder picker', async () => {
    const { app } = launched
    // Stand in for the native dialog (the IPC handler in app/main/ipc.js calls dialog.showOpenDialog)
    await app.evaluate(({ dialog }, folder) => {
      (dialog as any).showOpenDialog = async () => ({ canceled: false, filePaths: [folder] })
    }, syncRoot)

    await goto(main, '/settings/application')
    await expect(main.getByText('Cloud Providers')).toBeVisible()
    await main.getByText('Dropbox', { exact: true }).click()
    await expect(main.getByText(syncRoot)).toBeVisible()

    // Reduced by the main-process store, replayed into the window, and persisted
    expect((await getState(main)).system.providerPath.dropbox).toBe(syncRoot)
    await expect.poll(() => JSON.parse(readFileSync(join(userDataDir, 'storage/state.json'), 'utf8')).system.providerPath.dropbox).toBe(syncRoot)
    await screenshot(main, '03-settings-provider-folder')
  })

  test('sync: the project is linked to its cloud folder', async () => {
    await goto(main, `/project/${PROJECT_ID}/settings`)
    await expect(main.getByRole('heading', { name: 'Cloud Storage Folder' })).toBeVisible()
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
      // first run: the file is created in the cloud folder
      const created = await api('POST', `/sync/upload/${PROJECT_ID}`, {
        token,
        query: { name: SYNC_FILE, parentId: project.remote.root._id },
        body: '# Desktop sync check\n\nEdited by the Stemn Desktop end-to-end test.\n',
      })
      expect(created.status).toBe(200)
      file = (await api('GET', `/sync/listFolder/${PROJECT_ID}`, { token })).data.entries.find((entry: any) => entry.name === SYNC_FILE)
    }
    const download = await api('GET', `/sync/download/${PROJECT_ID}/${file.fileId}`, { token })
    expect(download.status).toBe(200)
    const localFile = join(projectFolder, SYNC_FILE)
    writeFileSync(localFile, typeof download.data === 'string' ? download.data : JSON.stringify(download.data))
    expect(readdirSync(projectFolder)).toContain(SYNC_FILE)

    // --- the user edits the file locally ---
    const stamp = new Date().toISOString()
    writeFileSync(localFile, `${readFileSync(localFile, 'utf8').trimEnd()}\n- ${stamp}: edited on the desktop\n`)

    // --- the sync client uploads the edit as a new revision ---
    const upload = await api('POST', `/sync/upload/${PROJECT_ID}/${file._id}`, { token, body: readFileSync(localFile) })
    expect(upload.status).toBe(200)

    // --- the app detects the change ---
    await goto(main, `/project/${PROJECT_ID}`)
    // A FileChangeRow (CSS-module class names are `<File>_<class>-<hash>`)
    const changeRow = main.locator('[class*="FileChangeRow_fileChangeRow"]', { hasText: SYNC_FILE })
    await expect(async () => {
      // Changes list "..." menu -> Refresh
      await main.getByTitle('Filter changes').click()
      await main.getByText('Refresh', { exact: true }).click()
      await expect(changeRow).toBeVisible({ timeout: 3000 })
    }).toPass({ timeout: 30_000 })

    // Preview the change (file compare of the new revision)
    await changeRow.getByText(SYNC_FILE).click()
    await expect(main.getByText(`${stamp}: edited on the desktop`).first()).toBeVisible()
    await screenshot(main, '05-change-detected')

    // --- commit only this change ---
    await changeRow.locator('[title="Select change"]').click()
    commitName = `Desktop sync check ${stamp}`
    await main.getByPlaceholder('Summary').fill(commitName)
    await expect.poll(async () => (await getState(main)).changes[PROJECT_ID].name).toBe(commitName)
    // The description is a CodeMirror editor (its placeholder is a separate element)
    await main.locator('.CodeMirror', { has: main.locator('.CodeMirror-placeholder', { hasText: 'Detailed description' }) }).click()
    await main.keyboard.type('Committed by the Stemn Desktop e2e test (Electron 45).')
    await main.getByText('Add Commit', { exact: true }).click()
    await expect(main.getByText(/1 files commited/)).toBeVisible()
    await screenshot(main, '06-committed')

    // The commit is on the server, with our revision
    await expect.poll(async () => {
      const timeline = await api('GET', '/timeline', { token, query: { entityId: PROJECT_ID, entityType: 'project', 'types[]': 'commits', size: '20' } })
      const commit = Array.isArray(timeline.data) && timeline.data.find((item: any) => item.data && item.data.name === commitName)
      // only our file was selected, so only its revision(s) are in the commit
      return commit ? [...new Set(commit.data.items.map((item: any) => item.data.name))] : timeline.status
    }).toEqual([SYNC_FILE])

    // ...and in the History tab (updated through the NEW_COMMITS websocket event)
    await main.getByText('History', { exact: true }).click()
    await expect(main.getByText(commitName)).toBeVisible()
    await screenshot(main, '07-history')
  })

  test('preview window: markdown file', async () => {
    const { app, getWindow } = launched
    await goto(main, `/project/${PROJECT_ID}/files`)
    // the file list row (the README below also mentions the file)
    await main.locator('a').getByText('tvac-results.md', { exact: true }).click()
    const preview = await getWindow('preview')
    await expect(preview.getByText('TVAC deployment campaign').first()).toBeVisible()
    await expect(preview.getByText('Meta', { exact: true })).toBeVisible()
    await screenshot(preview, '08-preview-markdown')

    // The file was downloaded by the main process into the FileCache
    const cacheFiles = readdirSync(join(userDataDir, 'FileCache'))
    expect(cacheFiles.length).toBeGreaterThan(0)
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()
      .filter(win => win.webContents.getURL().includes('/preview/'))
      .forEach(win => win.close()))
  })

  test('preview window: PDF file (served from the cache over stemn-file://)', async () => {
    const { getWindow, app } = launched
    await main.locator('a').getByText('deployment-analysis.pdf', { exact: true }).click()
    const preview = await getWindow('preview')
    await expect(preview.locator('canvas').first()).toBeVisible()
    await expect.poll(() => preview.evaluate(() => {
      const canvas = document.querySelector('canvas')
      return canvas ? canvas.width * canvas.height : 0
    })).toBeGreaterThan(0)
    // pdf.js rendered the page and its (selectable) text layer
    await expect(preview.locator('[class*="PreviewPdf_textLayer"] span', { hasText: 'Deployment analysis' })).toHaveCount(1)
    await preview.waitForTimeout(500)
    await screenshot(preview, '09-preview-pdf')
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()
      .filter(win => win.webContents.getURL().includes('/preview/'))
      .forEach(win => win.close()))
  })

  test('menubar (tray) window shows the active project changes', async () => {
    const { app, getWindow } = launched
    const menubar = await getWindow('menubar')
    await app.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows().find(w => w.webContents.getURL().includes('/menubar/'))!
      win.show()
    })
    await expect(menubar.getByText('CubeSat Deployable Solar Arr...', { exact: true })).toBeVisible()
    await expect(menubar.getByText(/file changes/)).toBeVisible()
    await screenshot(menubar, '10-menubar')

    // Menu actions scoped to the main window are forwarded to it (meta.scope: ['main'])
    await menubar.getByTitle('Options').click()
    await menubar.getByText('Preferences', { exact: true }).click()
    await expect.poll(() => main.url()).toContain('#/settings/application')
    await expect(menubar).toHaveURL(/menubar\/index\.html#\/project\//)
  })

  test('no uncaught exceptions in the main process or the renderers', async () => {
    const { mainLog, pageErrors } = launched
    expect(pageErrors).toEqual([])
    const errors = mainLog().filter(line => /Uncaught exception|\[renderer:\w+\] (Uncaught|Unhandled)|Preload error|Renderer of the \w+ window is gone/.test(line))
    expect(errors).toEqual([])
  })
})
