import { defineConfig } from '@playwright/test'

/**
 * End-to-end tests of the Tauri shell: Playwright Test is only the runner (same structure and
 * assertions as stemn-frontend-desktop/tests); the app is driven over WebDriver
 * (tauri-driver + WebKitWebDriver, WebdriverIO client) against a running Stemn backend
 * (STEMN_ENV=local: API :3000, websocket :8000).
 */
export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.ts/,
  globalSetup: './global-setup.ts',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  outputDir: '../qa/test-results',
})
