# Stemn Frontend Tauri

Stemn Desktop on [Tauri 2](https://tauri.app): the desktop app's own renderers (from
`stemn-frontend-desktop`, not copied) in a Rust shell. It is an evaluation of a replacement for the
Electron shell. [PARITY.md](PARITY.md) has the full capability comparison, the measurements and the
recommendation.

## How it fits together

```
src-tauri/            Rust (replaces the Electron main process for everything native)
  src/lib.rs            plugins, startup, single instance, the stemn-file:// protocol
  src/windows.rs        core / main / menubar / preview windows, navigation guard, bridge injection
  src/commands.rs       the bridge commands (renderers) and FunctionLibrary commands (core window)
  src/cache.rs          FileCache (downloads, index, zip renders, stemn-file urls)
  src/oauth.rs          local OAuth callback server (127.0.0.1:49554, rate limited)
  src/tray.rs           tray icon and menu
  src/args.rs           --hidden / --path / stemn: links
  capabilities/         what each window may call (renderer.json, core.json, e2e.json)
  tauri.conf.json       bundles (AppImage, deb, NSIS, MSI, app, dmg), updater, deep link, CLI
src/bridge/           window.stemnDesktop over invoke/events (the Electron preload, injected by Rust)
src/core/             the hidden "core" window: the Electron main-process store, unchanged, plus
                      Tauri versions of its Node/Electron modules (overrides/, shims/)
src/shared/           in-order delivery of the window <-> core messages
vite.config.ts        renderers: the `renderer` section of ../stemn-frontend-desktop/electron.vite.config.ts
vite.core.config.ts   core window: the `main` section of the same config (+ module overrides)
vite.bridge.config.ts the bridge as one script
tests/                WebDriver e2e (tauri-driver + WebdriverIO, Playwright Test as the runner)
```

The Electron main process does two jobs. The native half (windows, tray, dialogs, the file cache,
the protocol, the OAuth server, updates, auto-start, single instance) is Rust here. The JavaScript
half (the redux store that is the source of truth, the FunctionLibrary, the websocket client) runs
unchanged in a hidden webview, the **core window**. The renderers talk to it through the same
`window.stemnDesktop` API as in Electron, so no renderer or shared code changes.

## Requirements

- Node 24 and the workspace install (`npm install` at the repo root)
- Rust (stable) and the Tauri Linux libraries:
  `sudo apt-get install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev build-essential curl wget file libxdo-dev libssl-dev patchelf`
  (`libappindicator3-dev` works instead of the Ayatana one)
- For the e2e tests: `cargo install tauri-driver --locked` and `sudo apt-get install webkit2gtk-driver xvfb`
- A Stemn backend for `STEMN_ENV=local` (API :3000, websocket :8000, see `stemn-backend/local/README.md`)

## Commands

Run them here, or from the repo root with the same names.

| Command | What it does |
| --- | --- |
| `npm run tauri:dev` | Vite dev server (:5174, renderers + core page, React Fast Refresh) and the app in debug mode. `STEMN_ENV` defaults to `local`. |
| `npm run tauri:build` | Release build and installers for this OS (Linux: AppImage + deb in `src-tauri/target/release/bundle`). `STEMN_ENV` defaults to `production`. With `TAURI_SIGNING_PRIVATE_KEY` set, also the signed updater artefacts. |
| `npm run tauri:test` | Rust unit tests, then the WebDriver e2e suite (builds the debug app with the `e2e` feature first; `E2E_SKIP_BUILD=1` to reuse it). |
| `npm run tauri:check` | Validates the bundle config for Linux, Windows and macOS without building. |
| `npm run test:rust` / `npm run test:e2e` | The two halves of `tauri:test`. |
| `npm run typecheck` | `tsc` for the bridge, core, configs and tests. |
| `node scripts/measure.mjs` | Size / start-up / memory comparison with the Electron build (PARITY.md). |

If `/tmp` is mounted `noexec`, set `TMPDIR` to another folder for `tauri:build` (the AppImage tools
run from it).

### Environment (runtime)

Same names as the Electron app: `STEMN_USER_DATA_DIR` (profile: `storage/`, `FileCache/`, `logs/`,
`WebView/`), `STEMN_LOG_RENDERER_CONSOLE`, `STEMN_LOG_WEBSOCKET`, `STEMN_MENUBAR_STAY_OPEN`.
`STEMN_UPDATES_URL` points the updater at another feed (a staging or test feed).
Logs go to `<profile>/logs/main.log` with `STEMN_USER_DATA_DIR`, otherwise to the OS log folder
(Linux: `~/.local/share/com.stemn.desktop/logs/main.log`).

## Security model

- Renderers have no Node and no Tauri plugin APIs. Their capability (`capabilities/renderer.json`)
  allows exactly the bridge commands; the core window's allows the store, logging, auto-start and the
  FunctionLibrary commands. Rust adds the sender's window label to every message.
- The same Content-Security-Policy as the Electron renderers (built from `electron.vite.config.ts`),
  plus the Tauri IPC origin. No `unsafe-eval`.
- Windows only load the bundled pages: other navigations and `window.open` go to the system browser
  (http, https, mailto) or are blocked.
- `stemn-file://` only serves files inside `<profile>/FileCache`.
- The OAuth callback server listens on 127.0.0.1 only, 30 requests per minute.
- Updates are verified with a minisign public key (`plugins.updater.pubkey`).

## Updates and releases

`tauri-plugin-updater` reads a static `latest.json` from the same generic feed folder as the Electron
plan (`https://updates.stemn.com/desktop/<channel>/`, see
[docs/plans/desktop-auto-update-and-signing.md](../docs/plans/desktop-auto-update-and-signing.md)).
The public key in `tauri.conf.json` is a **development key**. Before a real release, generate the
production key (`npx tauri signer generate -w stemn-desktop.key`), put the public key in
`plugins.updater.pubkey` and the private key and its password in the CI secrets
`TAURI_SIGNING_PRIVATE_KEY` / `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. OS code signing (Windows
Authenticode, Apple notarisation) is configured in `bundle.windows` / `bundle.macOS` when the
certificates exist; nothing is signed today, as in the Electron app.

## End-to-end tests

```sh
# backend running with the seed data, X display available (DISPLAY, default :1)
npm run test:e2e
```

- `tests/e2e.spec.ts`: the 11 scenarios of `stemn-frontend-desktop/tests/e2e.spec.ts` with the same
  outcomes (startup windows and security, login as Priya, seeded projects, websocket events, folder
  picker, project link, local edit -> change -> commit -> history, markdown and PDF previews, menubar,
  no uncaught errors). Each run adds one commit to the CubeSat project, like the Electron suite.
- `tests/updater.spec.ts`: update from a local feed signed with a throwaway key; a bad signature is refused.
- `tests/shell.spec.ts`: `--hidden` / `--path`, single instance, OAuth callback server and rate limit,
  auto-start, `stemn-file://` confinement, navigation guard, window controls.

The app is the debug build with the `e2e` cargo feature: it adds three test commands
(`src-tauri/src/e2e.rs`, allowed by `capabilities/e2e.json`, which only the test build enables),
`STEMN_E2E_DIALOG_RESULT` stands in for the native folder picker, and external links are logged
instead of opened. Release builds have none of this. Screenshots go to `qa/` (git-ignored).
