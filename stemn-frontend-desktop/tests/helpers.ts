import { _electron as electron, ElectronApplication, Page, expect } from '@playwright/test'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const require = createRequire(__filename)

export const desktopRoot = join(__dirname, '..')
export const qaDir = join(desktopRoot, 'qa')
export const API = process.env.E2E_API_SERVER || 'http://localhost:3000'

export type WindowName = 'main' | 'menubar' | 'preview'

export interface LaunchedApp {
  app: ElectronApplication
  /** Every line the main process logged so far (electron-log file; includes forwarded renderer console warnings/errors) */
  mainLog: () => string[]
  /** Raw stdout/stderr of the Electron process (Chromium messages) */
  output: string[]
  /** Uncaught page errors of any window */
  pageErrors: string[]
  getWindow: (name: WindowName) => Promise<Page>
}

export const launchApp = async ({ userDataDir }: { userDataDir: string }): Promise<LaunchedApp> => {
  const env: Record<string, string> = {
    ...(process.env as Record<string, string>),
    DISPLAY: process.env.DISPLAY || ':1',
    STEMN_USER_DATA_DIR: userDataDir,
    STEMN_E2E: '1',
    STEMN_MENUBAR_STAY_OPEN: '1',
    STEMN_LOG_RENDERER_CONSOLE: '1',
    STEMN_LOG_WEBSOCKET: '1',
  }
  // Would start Electron as plain Node
  delete env.ELECTRON_RUN_AS_NODE

  const app = await electron.launch({
    executablePath: require('electron') as unknown as string,
    args: [desktopRoot],
    env,
  })

  const logFile = join(userDataDir, 'logs/main.log')
  const mainLog = () => (existsSync(logFile) ? readFileSync(logFile, 'utf8').split('\n').filter(Boolean) : [])
  const output: string[] = []
  const pageErrors: string[] = []
  const onOutput = (data: Buffer) => output.push(...data.toString().split('\n').filter(Boolean))
  app.process().stdout?.on('data', onOutput)
  app.process().stderr?.on('data', onOutput)

  const watch = (page: Page) =>
    page.on('pageerror', (error) => pageErrors.push(`${page.url()}: ${error.stack || error.message}`))
  app.windows().forEach(watch)
  app.on('window', watch)

  const getWindow = async (name: WindowName) => {
    await expect
      .poll(() => app.windows().some((page) => page.url().includes(`/${name}/index.html`)), { timeout: 30_000 })
      .toBe(true)
    const page = app.windows().find((p) => p.url().includes(`/${name}/index.html`))!
    await page.waitForLoadState('domcontentloaded')
    return page
  }

  return { app, mainLog, output, pageErrors, getWindow }
}

export const screenshot = async (page: Page, name: string) => {
  mkdirSync(qaDir, { recursive: true })
  await page.screenshot({ path: join(qaDir, `${name}.png`) })
}

/** Navigate a window's hash router */
export const goto = async (page: Page, hash: string) => {
  await page.evaluate((h) => {
    window.location.hash = h
  }, hash)
}

/** The renderer redux state of a window (window.__STEMN__ is set by app/renderer/shared/bootstrap.jsx) */
export const getState = (page: Page) => page.evaluate(() => (window as any).__STEMN__.store.getState())

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
