import { defineConfig } from '@playwright/test'

/**
 * Updater integration test: packages an unsigned AppImage (global-setup.ts), serves a local
 * generic update feed with a newer version and drives the installed AppImage with Playwright.
 * Linux only, needs an X display (DISPLAY, default :1; CI: xvfb-run). No backend needed.
 *   npm run test:updater          (UPDATER_SKIP_PACKAGE=1 reuses release/Stemn-<version>-linux-x86_64.AppImage)
 */
export default defineConfig({
  testDir: '.',
  testMatch: /updater\.spec\.ts/,
  globalSetup: './global-setup.ts',
  timeout: 240_000,
  expect: { timeout: 30_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  outputDir: '../../qa/updater-results',
})
