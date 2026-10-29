import { defineConfig } from '@playwright/test'

/**
 * End-to-end tests: Playwright drives the built Electron app (dist/) against a
 * running Stemn backend (STEMN_ENV=local: API :3000, websocket :8000).
 * See tests/README section in the package README.
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
