import { defineConfig, devices } from '@playwright/test'

/**
 * Website end-to-end tests (Chromium) against a running Stemn backend.
 *
 *   E2E_BASE_URL   test an already running website instead of starting one
 *   E2E_PORT       port for the website server started here (default 8081)
 *
 * Without E2E_BASE_URL the production build (stemn-frontend-website/build, built with
 * STEMN_ENV=local) is served with the website's express server. Build it first:
 *   STEMN_ENV=local pnpm run build && pnpm run test:e2e
 */
const port = Number(process.env.E2E_PORT) || 8081
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`

export default defineConfig({
  testDir: './specs',
  globalSetup: './global-setup.ts',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }], ['github']] : [['list']],
  outputDir: './test-results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'node ../../stemn-frontend-website/build/server/index.js',
        env: { PORT: String(port) },
        url: `${baseURL}/api/ping`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
})
