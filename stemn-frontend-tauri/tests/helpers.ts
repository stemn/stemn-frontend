/**
 * WebDriver harness for the Tauri app: tauri-driver (which starts WebKitWebDriver) per launch,
 * a WebdriverIO session, and Playwright-like helpers so the scenarios read like the Electron
 * suite (stemn-frontend-desktop/tests). Every Tauri window (core, main, menubar, previews) is a
 * WebDriver window handle; `win(name)` switches to it.
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { expect } from '@playwright/test'
import { remote } from 'webdriverio'

export const tauriRoot = join(import.meta.dirname, '..')
export const qaDir = join(tauriRoot, 'qa')
export const API = process.env.E2E_API_SERVER || 'http://localhost:3000'
export const appBinary =
  process.env.E2E_APP_BINARY ||
  join(tauriRoot, 'src-tauri/target/debug', process.platform === 'win32' ? 'stemn.exe' : 'stemn')

export type WindowName = 'main' | 'menubar' | 'preview' | 'core'
type Browser = Awaited<ReturnType<typeof remote>>

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number }
      server.close(() => resolve(port))
    })
  })

const waitForPort = async (port: number, timeout = 15_000) => {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/status`)
      if (response.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`tauri-driver did not start on ${port}`)
}

export interface InvokeResult<T = any> {
  ok: boolean
  value?: T
  error?: string
}

export interface LaunchedApp {
  browser: Browser
  driver: ChildProcess
  /** Every line of <profile>/logs/main.log (Rust, the core window and forwarded renderer console warnings/errors) */
  mainLog: () => string[]
  /** Switch WebDriver to a window (waits for it) and return the session */
  win: (name: WindowName) => Promise<Browser>
  /** invoke() a command from the main window (e2e test seams, or to check the capabilities) */
  invoke: <T = any>(
    command: string,
    args?: Record<string, unknown>,
  ) => Promise<{ ok: boolean; value?: T; error?: string }>
  close: () => Promise<void>
}

/** Environment of the app processes (tauri-driver -> WebKitWebDriver -> the app inherit it) */
export const appEnv = (userDataDir: string, env: Record<string, string> = {}) => ({
  ...(process.env as Record<string, string>),
  DISPLAY: process.env.DISPLAY || ':1',
  STEMN_USER_DATA_DIR: userDataDir,
  STEMN_E2E: '1',
  STEMN_MENUBAR_STAY_OPEN: '1',
  STEMN_LOG_RENDERER_CONSOLE: '1',
  STEMN_LOG_WEBSOCKET: '1',
  ...env,
})

export const launchApp = async ({
  userDataDir,
  env = {},
  args = [],
}: {
  userDataDir: string
  env?: Record<string, string>
  args?: string[]
}) => {
  const port = await freePort()
  const nativePort = await freePort()
  const driver = spawn('tauri-driver', ['--port', String(port), '--native-port', String(nativePort)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: appEnv(userDataDir, env),
  })
  await waitForPort(port)
  const browser = await remote({
    hostname: '127.0.0.1',
    port,
    logLevel: 'error',
    connectionRetryTimeout: 120_000,
    capabilities: { 'tauri:options': { application: appBinary, args } } as any,
  })

  const logFile = join(userDataDir, 'logs/main.log')
  const mainLog = () => (existsSync(logFile) ? readFileSync(logFile, 'utf8').split('\n').filter(Boolean) : [])

  let current: string | undefined
  const handleOf = async (name: WindowName) => {
    for (const handle of await browser.getWindowHandles()) {
      await browser.switchToWindow(handle)
      current = handle
      if ((await browser.getUrl()).includes(`/${name}/index.html`)) return handle
    }
    return undefined
  }
  const win = async (name: WindowName) => {
    // fast path: still on that window
    if (current) {
      try {
        if ((await browser.getUrl()).includes(`/${name}/index.html`)) return browser
      } catch {
        current = undefined
      }
    }
    try {
      await expect.poll(() => handleOf(name).catch(() => undefined), { timeout: 30_000 }).toBeTruthy()
    } catch (error) {
      const urls: string[] = []
      for (const handle of await browser.getWindowHandles()) {
        await browser.switchToWindow(handle)
        urls.push(await browser.getUrl())
      }
      throw new Error(`No ${name} window among the WebDriver windows ${JSON.stringify(urls)}`, { cause: error })
    }
    await browser.waitUntil(async () => (await browser.execute(() => document.readyState)) !== 'loading')
    return browser
  }

  const invoke = async (
    command: string,
    args: Record<string, unknown> = {},
    from: WindowName = 'main',
  ): Promise<InvokeResult> => {
    await win(from)
    // WebKitWebDriver reports some rejections (e.g. ACL denials) as a script error
    return (
      browser.execute(
        (cmd: string, cmdArgs: Record<string, unknown>) =>
          (window as any).__TAURI_INTERNALS__
            .invoke(cmd, cmdArgs)
            .then((value: unknown) => ({ ok: true, value }))
            .catch((error: unknown) => ({ ok: false, error: String(error) })),
        command,
        args,
      ) as Promise<InvokeResult>
    ).catch((error: Error): InvokeResult => ({ ok: false, error: error.message }))
  }

  const close = async () => {
    await browser.deleteSession().catch(() => {})
    driver.kill()
  }

  return { browser, driver, mainLog, win, invoke, close } satisfies LaunchedApp
}

/** XPath string literal */
const xpathString = (text: string) =>
  text.includes("'") ? `concat('${text.split("'").join(`', "'", '`)}')` : `'${text}'`

/** Elements whose own text is `text` (Playwright getByText exact), optionally inside `scope` (xpath) */
export const textXPath = (text: string, { exact = true, scope = '' }: { exact?: boolean; scope?: string } = {}) =>
  exact
    ? `${scope}//*[text()[normalize-space(.)=${xpathString(text)}]]`
    : `${scope}//*[text()[contains(normalize-space(.), ${xpathString(text)})]]`

/** The first displayed element matching an xpath / selector, waiting for it */
export const visible = async (browser: Browser, selector: string, timeout = 20_000) => {
  let found: any
  await browser.waitUntil(
    async () => {
      const elements = await browser.$$(selector)
      for (const element of elements) {
        if (await element.isDisplayed().catch(() => false)) {
          found = element
          return true
        }
      }
      return false
    },
    { timeout, timeoutMsg: `${selector} is not visible` },
  )
  return found as ReturnType<Browser['$']>
}

/**
 * Click the first visible match, retrying while something else is on top of it (closing menus,
 * toasts, animations), like Playwright's actionability checks.
 */
export const click = async (browser: Browser, selector: string, timeout = 20_000) => {
  let lastError: unknown
  await browser
    .waitUntil(
      async () => {
        try {
          await (await visible(browser, selector, 2000)).click()
          return true
        } catch (error) {
          lastError = error
          return false
        }
      },
      { timeout, interval: 250 },
    )
    .catch(() => {
      throw lastError instanceof Error ? lastError : new Error(`Could not click ${selector}`)
    })
}

export const clickText = (
  browser: Browser,
  text: string,
  options?: { exact?: boolean; scope?: string; timeout?: number },
) => click(browser, textXPath(text, options), options?.timeout)

/**
 * Playwright's `fill`: replace an input's value with one input event (the Electron suite uses
 * `fill`). Typing key by key would send one store round trip per character (see PARITY.md).
 */
export const fill = async (browser: Browser, selector: string, value: string) => {
  const element = await visible(browser, selector)
  await element.click()
  await (browser.execute as any)(
    (el: HTMLInputElement, text: string) => {
      const prototype = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(el, text)
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }))
    },
    element,
    value,
  )
}

export const byText = (
  browser: Browser,
  text: string,
  options?: { exact?: boolean; scope?: string; timeout?: number },
) => visible(browser, textXPath(text, options), options?.timeout)

export const count = async (browser: Browser, selector: string) => (await browser.$$(selector)).length

export const screenshot = async (browser: Browser, name: string) => {
  mkdirSync(qaDir, { recursive: true })
  await browser.saveScreenshot(join(qaDir, `${name}.png`))
}

/** Navigate the current window's hash router */
export const goto = (browser: Browser, hash: string) =>
  browser.execute((h: string) => {
    window.location.hash = h
  }, hash)

/** The renderer redux state of the current window (window.__STEMN__ from app/renderer/shared/bootstrap.jsx) */
export const getState = (browser: Browser) => browser.execute(() => (window as any).__STEMN__.store.getState())

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Minimal Stemn API client, used to play the part of the cloud storage sync client */
export const api = async (
  method: string,
  path: string,
  {
    token,
    json,
    body,
    query,
  }: { token?: string; json?: any; body?: string | Buffer; query?: Record<string, string> } = {},
) => {
  const url = new URL(`${API}/api/v1${path}`)
  Object.entries(query || {}).forEach(([key, value]) => url.searchParams.set(key, value))
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `bearer ${token}`
  if (json !== undefined) headers['Content-Type'] = 'application/json'
  if (body !== undefined) headers['Content-Type'] = 'application/octet-stream'
  const requestBody =
    json !== undefined
      ? JSON.stringify(json)
      : typeof body === 'string' || body === undefined
        ? body
        : new Uint8Array(body)
  const response = await fetch(url, { method, headers, body: requestBody })
  const text = await response.text()
  let data: any = text
  try {
    data = JSON.parse(text)
  } catch {
    /* not json */
  }
  return { status: response.status, data }
}
