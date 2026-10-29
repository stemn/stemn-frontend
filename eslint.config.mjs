// ESLint 10 flat config for the whole monorepo (website, shared, desktop, e2e tests, build configs).
//
//   npm run lint        eslint + prettier --check
//   npm run lint:fix    eslint --fix + prettier --write
//
// Formatting is Prettier's job (eslint-config-prettier switches off the stylistic rules).
// Rules that the legacy code base violates in bulk are switched off below with a reason;
// see docs/DECISIONS.md for the policy (tighten them as code is converted to TypeScript).
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { importX } from 'eslint-plugin-import-x'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

const sourceFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}']

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/out/**',
      '**/release/**',
      '**/qa/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/coverage/**',
      // Tauri shell: the bridge bundle and Rust build output / generated schemas
      '**/dist-bridge/**',
      'stemn-frontend-tauri/src-tauri/target/**',
      'stemn-frontend-tauri/src-tauri/gen/**',
      // Vendored third-party code
      'stemn-frontend-website/public/static/**',
      'stemn-frontend-shared/src/misc/Websocket/primus-websockets2.js',
      'stemn-frontend-shared/src/misc/Files/PreviewFile/PreviewPcb/viewer/**',
    ],
  },
  {
    files: sourceFiles,
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, GLOBAL_ENV: 'readonly' },
    },
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts'],
    },
    rules: {
      // Module resolution (aliases, `.web`/`.desktop`/`.electron` suffixes) is checked by the
      // bundlers and tsc; the import resolver does not model the platform suffixes.
      'import-x/no-unresolved': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true, caughtErrors: 'none' }],
      // Legacy JavaScript: `any`, empty catch blocks and `require` in CommonJS config files are expected.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  // React (website, shared, desktop renderers)
  {
    files: ['stemn-frontend-{website,shared,desktop}/**/*.{jsx,tsx,js,ts}'],
    extends: [react.configs['recommended-typescript'], reactHooks.configs.flat['recommended-latest']],
    rules: {
      // React Compiler rules of eslint-plugin-react-hooks 7: the class-component era code base is not
      // compiler-ready; they are advisory until the components are rewritten.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/incompatible-library': 'off',
      // Known legacy debt, tracked as follow-ups rather than rewritten here:
      // UNSAFE_ lifecycles were introduced by the React 19 codemod (class components).
      '@eslint-react/no-unsafe-component-will-mount': 'off',
      '@eslint-react/no-unsafe-component-will-receive-props': 'off',
      // Static, never re-ordered lists (table rows, menu items, skeletons).
      '@eslint-react/no-array-index-key': 'off',
      // cloneElement / Children.toArray are used by the local ports of react-flip-move and the
      // Popover/Tabs wrappers; replacing them means redesigning those components.
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-children-to-array': 'off',
    },
  },
  // React Fast Refresh: modules that export components should only export components
  {
    files: ['stemn-frontend-{website,shared,desktop}/**/*.{jsx,tsx}'],
    extends: [reactRefresh.configs.vite],
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          extraHOCs: ['connect', 'fetchDataHoc', 'withRouteProps', 'clickDrag', 'DragSource', 'DropTarget'],
        },
      ],
    },
  },
  // Node: build configs, scripts, the express server, the Electron main process, tests
  {
    files: [
      '**/*.config.{js,mjs,cjs,ts,mts}',
      '**/config/**',
      '**/scripts/**',
      'stemn-frontend-website/src/server/**',
      'stemn-frontend-desktop/app/main/**',
      'stemn-frontend-desktop/app/preload/**',
      'stemn-frontend-desktop/tests/**',
      'stemn-frontend-shared/src/desktop/**',
      'tests/**',
    ],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: [
      '**/*.cjs',
      'stemn-frontend-website/config/*.js',
      'stemn-frontend-website/scripts/*.js',
      'stemn-frontend-website/src/server/**/*.js',
    ],
    languageOptions: { sourceType: 'commonjs' },
  },
  prettier,
)
