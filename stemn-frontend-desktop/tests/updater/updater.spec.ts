/**
 * Updater integration test: an installed (unsigned) AppImage updates itself from a local generic
 * feed.
 *
 *   npm run test:updater      (packages the AppImage first; UPDATER_SKIP_PACKAGE=1 to reuse it)
 *
 *  1. the AppImage built from this checkout is "installed" into a temp dir and launched with
 *     STEMN_UPDATES_URL pointing at a local http feed that advertises 99.0.0
 *  2. update-available -> update-downloaded (structured updater log + feed requests)
 *  3. the UI prompt: release notes dialog from the feed, "Restart to update" in the title bar,
 *     the tray window banner
 *  4. quitAndInstall is refused while a commit is in flight
 *  5. once the commit is over, "Restart to update" installs: electron-updater replaces the
 *     AppImage with the downloaded one and relaunches it (the stand-in records that), the app quits
 */
import { _electron as electron, ElectronApplication, Page, expect, test } from '@playwright/test'
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import {
  FeedServer,
  NEW_VERSION,
  appImagePath,
  createFeed,
  currentVersion,
  ensureQaDir,
  qaDir,
  serveFeed,
} from './feed-server'

const PROJECT_ID = 'updater-test-project'

test.describe.serial('Stemn Desktop auto-update (AppImage, local generic feed)', () => {
  // Under qa/ (git-ignored) rather than the OS temp dir, which may be mounted noexec
  ensureQaDir()
  const workDir = mkdtempSync(join(qaDir, 'updater-work-'))
  const installDir = join(workDir, 'Applications')
  const userDataDir = join(workDir, 'profile')
  const feedRoot = join(workDir, 'feed')
  const marker = join(workDir, 'relaunched.txt')
  const installed = join(installDir, `Stemn-${currentVersion()}-linux-x86_64.AppImage`)

  let feed: FeedServer
  let app: ElectronApplication
  let main: Page
  let exited: Promise<number | null>
  let running = false
  const pageErrors: string[] = []

  const mainLog = () => {
    const file = join(userDataDir, 'logs/main.log')
    return existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean) : []
  }
  /** The structured `[updater] {...}` lines */
  const updaterEvents = () =>
    mainLog()
      .map((line) => /\[updater\] (\{.*\})$/.exec(line))
      .filter(Boolean)
      .map((match) => JSON.parse(match![1]))

  const getWindow = async (name: 'main' | 'menubar') => {
    await expect.poll(() => app.windows().some((page) => page.url().includes(`/${name}/index.html`))).toBe(true)
    const page = app.windows().find((p) => p.url().includes(`/${name}/index.html`))!
    await page.waitForLoadState('domcontentloaded')
    return page
  }

  test.beforeAll(async () => {
    mkdirSync(installDir, { recursive: true })
    copyFileSync(appImagePath(), installed)
    chmodSync(installed, 0o755)
    await createFeed(feedRoot)
    feed = await serveFeed(feedRoot)

    const env: Record<string, string> = {
      ...(process.env as Record<string, string>),
      DISPLAY: process.env.DISPLAY || ':1',
      STEMN_USER_DATA_DIR: userDataDir,
      STEMN_E2E: '1',
      STEMN_MENUBAR_STAY_OPEN: '1',
      STEMN_LOG_RENDERER_CONSOLE: '1',
      STEMN_UPDATES_URL: feed.url,
      STEMN_UPDATER_DELAY_MS: '0',
      STEMN_UPDATER_TEST_MARKER: marker,
      // electron-updater downloads into $XDG_CACHE_HOME/<updaterCacheDirName>/pending
      XDG_CACHE_HOME: join(workDir, 'cache'),
    }
    delete env.ELECTRON_RUN_AS_NODE
    delete env.APPIMAGE

    app = await electron.launch({ executablePath: installed, args: [], env })
    running = true
    exited = new Promise((resolve) =>
      app.process().on('exit', (code) => {
        running = false
        resolve(code)
      }),
    )
    const watch = (page: Page) => page.on('pageerror', (error) => pageErrors.push(`${page.url()}: ${error.message}`))
    app.windows().forEach(watch)
    app.on('window', watch)
    main = await getWindow('main')
  })

  test.afterAll(async () => {
    if (app && running) await app.close().catch(() => {})
    await feed?.close()
    if (!process.env.UPDATER_KEEP_WORKDIR) rmSync(workDir, { recursive: true, force: true })
  })

  test('finds the newer version on the feed and downloads it', async () => {
    await expect
      .poll(() => updaterEvents().map((entry) => entry.event), { timeout: 90_000 })
      .toContain('update-downloaded')
    const events = updaterEvents()
    const names = events.map((entry) => entry.event)
    expect(names.slice(0, 2)).toEqual(['configured', 'started'])
    expect(names.indexOf('update-available')).toBeGreaterThan(names.indexOf('checking'))
    expect(names.indexOf('update-downloaded')).toBeGreaterThan(names.indexOf('update-available'))
    expect(events.find((entry) => entry.event === 'configured')).toMatchObject({
      channel: 'stable',
      provider: 'generic',
      url: `${feed.url}/stable/`,
      channelFile: 'latest',
      autoDownload: true,
    })
    expect(events.find((entry) => entry.event === 'started')).toMatchObject({
      supported: true,
      version: currentVersion(),
    })
    expect(events.find((entry) => entry.event === 'update-available')).toMatchObject({
      version: NEW_VERSION,
      autoDownload: true,
    })
    expect(events.find((entry) => entry.event === 'update-downloaded')).toMatchObject({ version: NEW_VERSION })
    expect(feed.requests).toContain('GET /desktop/stable/latest-linux.yml')
    expect(feed.requests).toContain(`GET /desktop/stable/Stemn-${NEW_VERSION}-linux-x86_64.AppImage`)

    const status = await main.evaluate(() => window.stemnDesktop.updates.getStatus())
    expect(status).toMatchObject({
      currentVersion: currentVersion(),
      channel: 'stable',
      supported: true,
      downloaded: { version: NEW_VERSION },
      pendingCommits: [],
    })
  })

  test('prompts with the release notes and "Restart to update"', async () => {
    const dialog = main.getByTestId('release-notes-modal')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(`Stemn ${NEW_VERSION} is ready to install`)
    await expect(dialog).toContainText('Release notes from the update feed')
    await expect(dialog.getByRole('button', { name: 'Restart to update' })).toBeVisible()
    await expect(main.getByTestId('restart-to-update')).toBeVisible()
    await main.waitForTimeout(500) // modal fade-in
    await main.screenshot({ path: join(qaDir, 'updater-01-prompt.png') })

    const state = await main.evaluate(() => (window as any).__STEMN__.store.getState().autoUpdate)
    expect(state).toMatchObject({ updateDownloaded: true, release: { version: NEW_VERSION }, channel: 'stable' })

    const menubar = await getWindow('menubar')
    await app.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows()
        .find((win) => win.webContents.getURL().includes('/menubar/'))!
        .show()
    })
    await expect(menubar.getByTestId('update-banner')).toContainText(`Stemn ${NEW_VERSION} is ready to install.`)
    await menubar.screenshot({ path: join(qaDir, 'updater-02-menubar-banner.png') })
  })

  test('refuses to restart while a commit is in flight', async () => {
    await main.evaluate((projectId) => {
      ;(window as any).__STEMN__.store.dispatch({ type: 'CHANGES/COMMIT_PENDING', meta: { cacheKey: projectId } })
    }, PROJECT_ID)
    await expect
      .poll(() => main.evaluate(() => window.stemnDesktop.updates.getStatus().then((s) => s!.pendingCommits)))
      .toEqual([PROJECT_ID])

    const result = await main.evaluate(() => window.stemnDesktop.updates.quitAndInstall())
    expect(result).toEqual({ ok: false, reason: 'commit-in-progress', message: expect.stringMatching(/commit/) })

    // The dialog's button is refused the same way and says why
    const dialog = main.getByTestId('release-notes-modal')
    await dialog.getByRole('button', { name: 'Restart to update' }).click()
    await expect(dialog).toContainText('A commit is still being saved')
    await main.screenshot({ path: join(qaDir, 'updater-03-refused-during-commit.png') })

    await main.waitForTimeout(1000)
    expect(running).toBe(true)
    expect(existsSync(installed)).toBe(true)
    expect(existsSync(marker)).toBe(false)
    expect(updaterEvents().filter((entry) => entry.event === 'install-refused')).toEqual([
      { event: 'install-refused', reason: 'commit-in-progress', projects: [PROJECT_ID] },
      { event: 'install-refused', reason: 'commit-in-progress', projects: [PROJECT_ID] },
    ])
  })

  test('installs the update and relaunches once the commit is over', async () => {
    await main.evaluate((projectId) => {
      ;(window as any).__STEMN__.store.dispatch({
        type: 'CHANGES/COMMIT_REJECTED',
        meta: { cacheKey: projectId },
        error: true,
      })
    }, PROJECT_ID)
    await expect
      .poll(() => main.evaluate(() => window.stemnDesktop.updates.getStatus().then((s) => s!.pendingCommits)))
      .toEqual([])

    expect(pageErrors).toEqual([])
    await main.getByTestId('restart-to-update').click()
    const code = await Promise.race([exited, new Promise((resolve) => setTimeout(() => resolve('timeout'), 30_000))])
    expect(code).not.toBe('timeout')

    // electron-updater replaced the AppImage with the downloaded version and started it
    await expect.poll(() => existsSync(marker), { timeout: 15_000 }).toBe(true)
    expect(readFileSync(marker, 'utf8').trim()).toBe('relaunched silent=true')
    expect(readdirSync(installDir)).toEqual([`Stemn-${NEW_VERSION}-linux-x86_64.AppImage`])
    expect(updaterEvents().at(-1)).toEqual({ event: 'install', version: NEW_VERSION })
  })

  test('no uncaught exceptions in the main process or the renderers', async () => {
    expect(pageErrors).toEqual([])
    const errors = mainLog().filter((line) =>
      /Uncaught exception|\[renderer:\w+\] (Uncaught|Unhandled)|Preload error|Renderer of the \w+ window is gone/.test(
        line,
      ),
    )
    expect(errors).toEqual([])
  })
})
