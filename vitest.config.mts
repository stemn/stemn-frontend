/**
 * Vitest (unit tests) for the whole monorepo: `npm test` / `npm run test:watch`.
 * Tests live next to the code as `*.test.(ts|tsx|js|jsx|mts)`. They resolve modules like the
 * website build (`stemn-shared/*` alias, `.web.*` first) with a web GLOBAL_ENV.
 * End-to-end tests are separate (Playwright: tests/e2e, stemn-frontend-desktop/tests).
 */
import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

const root = import.meta.dirname
const sharedSrc = join(root, 'stemn-frontend-shared/src')

export default defineConfig({
  resolve: {
    alias: [{ find: /^stemn-shared(?=\/|$)/, replacement: sharedSrc }],
    extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  define: {
    GLOBAL_ENV: JSON.stringify({
      APP_TYPE: 'web',
      NODE_ENV: 'test',
      API_SERVER: 'http://localhost:3000',
      WEBSOCKET_SERVER: 'http://localhost:8000',
      WEBSITE_URL: 'http://localhost:8081',
    }),
  },
  test: {
    include: ['stemn-frontend-{website,shared,desktop}/**/*.test.{ts,tsx,js,jsx,mts}'],
    exclude: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/out/**'],
    environment: 'node',
  },
})
