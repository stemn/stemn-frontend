/**
 * Shell features of the Tauri app that the Electron suite does not cover (see PARITY.md):
 * launch arguments and single instance, the local OAuth callback server and its rate limit,
 * auto-start, the stemn-file:// confinement and the navigation guard.
 */
import { test, expect } from '@playwright/test'
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { appBinary, appEnv, getState, launchApp, sleep } from './helpers'

const profile = () => mkdtempSync(join(tmpdir(), 'stemn-tauri-shell-profile-'))

/** The app process of a profile (launched by WebKitWebDriver, so its pid is looked up) */
const appPid = (userDataDir: string) =>
  execFileSync('pgrep', ['-f', 'target/debug/stemn$'])
    .toString()
    .trim()
    .split('\n')
    .map(Number)
    .find((pid) => {
      try {
        return readFileSync(`/proc/${pid}/environ`, 'utf8').split('\0').includes(`STEMN_USER_DATA_DIR=${userDataDir}`)
      } catch {
        return false
      }
    })

/**
 * The tray menu as the desktop shell sees it: AppIndicator exports it over D-Bus (dbusmenu),
 * so it can be read and clicked without a panel.
 */
const trayMenu = (pid: number) => {
  const busctl = (...args: string[]) => execFileSync('busctl', ['--user', '--json=short', ...args]).toString()
  const peers = JSON.parse(busctl('list')) as { name: string; pid: number }[]
  const path = '/org/ayatana/NotificationItem/tray_icon_tray_app_stemn/Menu'
  const name = peers
    .filter((peer) => peer.pid === pid && peer.name.startsWith(':'))
    .map((peer) => peer.name)
    .find((candidate) => {
      try {
        busctl('introspect', candidate, path)
        return true
      } catch {
        return false
      }
    })
  if (!name) throw new Error(`no tray menu on the session bus for ${pid}`)
  const layout = JSON.parse(
    busctl('call', name, path, 'com.canonical.dbusmenu', 'GetLayout', 'iias', '0', '--', '-1', '0'),
  )
  const items = layout.data[1][2].map(({ data: [id, props] }: any) => ({
    id: id as number,
    label: props.label?.data as string | undefined,
    enabled: props.enabled ? (props.enabled.data as boolean) : true,
    separator: props.type?.data === 'separator',
  }))
  const click = (label: string) => {
    const item = items.find((i: any) => i.label === label)
    busctl('call', name, path, 'com.canonical.dbusmenu', 'Event', 'isvu', String(item.id), 'clicked', 's', '', '0')
  }
  return { items, click }
}

const windowsOf = async (app: Awaited<ReturnType<typeof launchApp>>, from: 'main' | 'preview' = 'main') =>
  ((await app.invoke('e2e_windows', {}, from)).value || []) as { label: string; url: string; visible: boolean }[]

test.describe.serial('Stemn Desktop (Tauri) shell', () => {
  test('--hidden starts in the tray, --path opens a preview, a second instance hands over its arguments', async () => {
    const userDataDir = profile()
    const localFile = join(mkdtempSync(join(tmpdir(), 'stemn-tauri-path-')), 'part one.md')
    writeFileSync(localFile, '# part\n')
    const app = await launchApp({ userDataDir, args: ['--hidden', '--path', localFile] })
    try {
      await expect.poll(async () => (await windowsOf(app)).map((w) => w.label)).toContain('preview-1')
      await sleep(3000) // the main window would have been shown by now
      const windows = await windowsOf(app)
      expect(windows.find((w) => w.label === 'main')!.visible).toBe(false)
      expect(decodeURIComponent(windows.find((w) => w.label === 'preview-1')!.url.replace(/\+/g, ' '))).toContain(
        `localPath=${localFile}`,
      )
      expect(app.mainLog().some((line) => line.includes('hidden: true'))).toBe(true)

      // A second instance (e.g. the Windows explorer "View revisions in Stemn" entry) exits and the
      // running one opens the preview; without --path it shows the main window
      const second = (args: string[]) =>
        new Promise<number | null>((resolve) => {
          const child = spawn(appBinary, args, { env: appEnv(userDataDir), stdio: 'ignore' })
          child.on('exit', (code) => resolve(code))
        })
      expect(await second(['--path', localFile])).toBe(0)
      await expect.poll(async () => (await windowsOf(app)).map((w) => w.label)).toContain('preview-2')
      // the bridge's window controls act on their own window: close a preview, then the main window;
      // the app keeps running (in the tray) and a stemn: link brings a new main window up
      const preview = await app.win('preview')
      // (deferred: WebDriver would report the script's window as gone)
      await preview.execute(() => {
        setTimeout(() => (window as any).stemnDesktop.window.close(), 100)
      })
      await expect.poll(async () => (await windowsOf(app)).filter((w) => w.label.startsWith('preview-')).length).toBe(1)
      const main = await app.win('main')
      expect(await main.execute(() => (window as any).stemnDesktop.window.isMaximized())).toBe(false)
      // (deferred: WebDriver would report the script's window as gone)
      await main.execute(() => {
        setTimeout(() => (window as any).stemnDesktop.window.close(), 100)
      })
      await expect
        .poll(async () => (await windowsOf(app, 'preview')).map((w) => w.label.replace(/\d+$/, 'n')))
        .toEqual(['core', 'menubar', 'preview-n'])
      expect(await second(['stemn:open'])).toBe(0)
      await expect.poll(async () => (await windowsOf(app)).find((w) => w.label === 'main')!.visible).toBe(true)
    } finally {
      await app.close()
    }
  })

  test('tray icon and menu: items, Open Mini Window, Preferences, Quit', async () => {
    test.skip(process.platform !== 'linux', 'reads the AppIndicator menu over D-Bus')
    const userDataDir = profile()
    const app = await launchApp({ userDataDir })
    try {
      await app.win('main')
      const pid = appPid(userDataDir)!
      const tray = trayMenu(pid)
      // createTrayIcon.js: same items, Account Settings only enabled when signed in
      expect(tray.items.map((i: any) => (i.separator ? '---' : i.label))).toEqual([
        'Open Main Window',
        'Open Mini Window',
        'Open Website',
        '---',
        'Preferences',
        'Account Settings',
        '---',
        'Quit',
      ])
      expect(tray.items.find((i: any) => i.label === 'Account Settings').enabled).toBe(false)

      tray.click('Open Mini Window')
      await expect.poll(async () => (await windowsOf(app)).find((w) => w.label === 'menubar')!.visible).toBe(true)
      tray.click('Preferences')
      await expect.poll(async () => (await app.win('main')).getUrl()).toContain('#/settings/application')

      tray.click('Quit')
      await expect.poll(() => existsSync(`/proc/${pid}`)).toBe(false)
    } finally {
      await app.close()
    }
  })

  test('local OAuth callback server: hands the code to the store, localhost only, rate limited', async () => {
    const app = await launchApp({ userDataDir: profile() })
    try {
      await app.win('main')
      await sleep(1000)
      const response = await fetch('http://127.0.0.1:49554/api/auth/dropbox?code=e2e-code')
      expect(response.status).toBe(200)
      expect(await response.text()).toContain('Authorisation Successful')
      expect(response.headers.get('ratelimit-policy')).toBe('30;w=60')
      // sendAuthToken({ provider: 'dropbox', code }) ran in the core store (the backend rejects the fake code)
      await expect.poll(() => app.mainLog().some((line) => line.includes('OAuth callback for dropbox'))).toBe(true)
      expect((await fetch('http://127.0.0.1:49554/api/auth/github?code=x')).status).toBe(404)
      const statuses: number[] = []
      for (let i = 0; i < 30; i += 1) statuses.push((await fetch('http://127.0.0.1:49554/nope')).status)
      expect(statuses.filter((status) => status === 429).length).toBeGreaterThan(0)
      expect(statuses.slice(0, 27).every((status) => status === 404)).toBe(true)
    } finally {
      await app.close()
    }
  })

  test('auto-start setting writes a --hidden launcher entry', async () => {
    test.skip(process.platform !== 'linux', 'XDG autostart is checked on Linux')
    // auto-launch writes ~/.config/autostart: use a throwaway HOME, never the real one
    const home = mkdtempSync(join(tmpdir(), 'stemn-tauri-home-'))
    const app = await launchApp({ userDataDir: profile(), env: { HOME: home } })
    try {
      const main = await app.win('main')
      await main.execute(() =>
        (window as any).__STEMN__.store.dispatch({ type: 'AUTO_LAUNCH/TOGGLE', payload: {}, meta: { status: true } }),
      )
      const autostart = join(home, '.config', 'autostart')
      await expect.poll(() => existsSync(autostart) && readdirSync(autostart).length).toBe(1)
      const entry = readFileSync(join(autostart, readdirSync(autostart)[0]), 'utf8')
      expect(entry).toMatch(/^Exec=.*stemn.* --hidden$/m)
      await main.execute(() =>
        (window as any).__STEMN__.store.dispatch({ type: 'AUTO_LAUNCH/GET_STATUS', payload: {} }),
      )
      await main.execute(() =>
        (window as any).__STEMN__.store.dispatch({ type: 'AUTO_LAUNCH/TOGGLE', payload: {}, meta: { status: false } }),
      )
      await expect.poll(() => readdirSync(autostart).length).toBe(0)
    } finally {
      await app.close()
    }
  })

  test('renderers: only cached files over stemn-file://, no navigation away from the app', async () => {
    const userDataDir = profile()
    const app = await launchApp({ userDataDir })
    try {
      const main = await app.win('main')
      await sleep(1000)
      const status = (url: string) =>
        main.execute(
          (u: string) =>
            fetch(u).then(
              (r) => r.status,
              () => -1,
            ),
          url,
        )
      // storage/state.json is next to FileCache/: not reachable
      expect(await status('stemn-file://cache/..%2Fstorage%2Fstate.json')).toBe(404)
      expect(await status('stemn-file://cache/%2E%2E/storage/state.json')).toBe(404)
      expect(await status('stemn-file://other/state.json')).toBe(404)

      // navigation away from the app is refused and goes to the system browser (e2e builds only log
      // it); non-web schemes are refused by the bridge
      await main.execute(() => {
        window.location.href = 'https://example.com/navigated'
      })
      await sleep(1000)
      expect(await main.getUrl()).toContain('/main/index.html')
      await expect
        .poll(
          () =>
            app.mainLog().filter((line) => /Opening https:\/\/example\.com\/navigated in the system browser/.test(line))
              .length,
        )
        .toBe(1)
      // shell.openPath / showItemInFolder report missing paths (existing ones would open a file manager)
      const bridge = (fn: string, path: string) =>
        main.execute((f: string, p: string) => (window as any).stemnDesktop.shell[f](p), fn, path)
      expect(await bridge('openPath', '/nonexistent/file.step')).toBe('/nonexistent/file.step does not exist')
      expect(await bridge('showItemInFolder', '/nonexistent/file.step')).toBe(false)
      expect(
        await main.execute(() =>
          (window as any).stemnDesktop.shell.openExternal('file:///etc/hosts').then(
            () => 'opened',
            (error: unknown) => String(error),
          ),
        ),
      ).toMatch(/Refusing to open/)
      expect((await windowsOf(app)).length).toBe(3)
      expect((await getState(main)).auth).toBeTruthy()
    } finally {
      await app.close()
    }
  })
})
