# Stemn Desktop: Electron 45 vs Tauri 2 parity report

Status as of 2026-10-30, on `feat/tauri-shell`. Compared builds: `stemn-frontend-desktop` (Electron 45.1.0,
electron-vite 6) and `stemn-frontend-tauri` (Tauri 2.12.5, WebKitGTK 2.52.6 on Ubuntu 24.04, Rust 1.101).
Both apps run the same renderer code from `stemn-frontend-desktop/app/renderer` and
`stemn-frontend-shared`, unchanged.

**Status values.** *Verified*: an automated test exercises it, and the evidence column names the test.
*Implemented*: the code is there and compiles, but nothing here exercises it end to end (the reason is
given). *Partial*: it works with a stated difference. *Missing*: not ported. The test files are under
`stemn-frontend-tauri/`: `tests/e2e.spec.ts` holds the 11 ported Electron scenarios (E1 to E11),
`tests/shell.spec.ts` holds S1 to S5, `tests/updater.spec.ts` holds U1 and U2, and the Rust unit tests
are in `src-tauri/src/*.rs` (38 tests).

## 1. Architecture in one paragraph

In Electron, the main process does two jobs: native work (windows, tray, dialogs, protocol, OAuth
server, updater) and a JavaScript redux store that is the source of truth. In the Tauri shell, Rust does
the native work. The store, with its FunctionLibrary, websocket client and middleware, runs **unchanged**
in a hidden webview, the *core window* (`src/core`). It is built from the `main` section of
`electron.vite.config.ts`. A Vite resolver plugin swaps the 11 main-process modules that need Node or
Electron (`vite.shared.ts` `coreFileOverrides`) and shims 3 libraries. The renderers are built from the
`renderer` section of the same config. `window.stemnDesktop` (the preload API) is injected by Rust as an
initialization script (`src/bridge`). It talks to Rust commands and to the core window through
`stemn:to-core` / `stemn:to-renderer` events. Each message carries a sequence number, so ordering
matches Electron IPC (`src/shared/sequencer.ts`).

## 2. Parity matrix

### 2.1 The preload bridge (`window.stemnDesktop`, `app/preload/types.ts`)

| # | Bridge member | Electron | Tauri | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| B1 | `platform` | `process.platform` in the preload | Rust `node_platform()` in the init script | Verified | E1 (bridge keys); renderers render the Linux title bar |
| B2 | `versions` | electron/chrome/node | same keys (empty strings) plus `tauri`, `webview` | Partial | Keys kept for type compatibility; no renderer reads them |
| B3 | `getInitialState()` | `ipcRenderer.invoke(GET_INITIAL_STATE)` | `bridge_to_core` request, answered by `core_send` with a snapshot and the sequence number it contains; retried until the core window is up | Verified | E1 to E10 (every window boots from it) |
| B4 | `dispatchToMain(action)` | `ipcRenderer.send(REDUX_ACTION)` | `bridge_to_core` (sync command, ordered, sender label added by Rust) | Verified | E2 (login form input round trip through the core store). Round trip 4 ms vs 0.8 ms (§3, gap 14) |
| B5 | `forwardToWindow(target, action)` | `FORWARD_TO_WINDOW` | `bridge_to_core { kind: 'forward' }`, then the core broadcasts with `target` | Verified | E10 (menubar Preferences navigates the main window) |
| B6 | `onAction(listener)` | `ipcRenderer.on(REDUX_ACTION)` | window-scoped `stemn:to-renderer` listener and an in-order sequencer; actions that arrive between the snapshot and `onAction` are queued (Electron dropped them) | Verified | E2 to E10; `sequencer.test.ts` (10 tests) |
| B7 | `window.minimize / toggleMaximize / close / isMaximized` | `WINDOW_COMMAND` | `bridge_window_command` on the calling window | Verified (close, isMaximized); Implemented (minimize, toggleMaximize) | S1 (close a preview and the main window from their bridges), E1 (isMaximized). minimize and maximize are no-ops under the i3 tiling WM on this machine |
| B8 | `dialog.selectDirectory(options)` | `dialog.showOpenDialog` | `tauri-plugin-dialog` `pick_folder` with the window as parent | Partial | E5. The native dialog is stubbed in both suites (`STEMN_E2E_DIALOG_RESULT` here, `app.evaluate` in Electron). `buttonLabel` is ignored: the GTK, Windows and macOS pickers in the plugin don't support it |
| B9 | `shell.openExternal(url)` | `shell.openExternal`, http/https/mailto only | `bridge_open_external` → `tauri-plugin-opener`, same check | Verified | S5 (`file:` refused); `system::external_urls` unit test |
| B10 | `shell.openPath(path)` | `shell.openPath`, error string | `bridge_open_path` → opener `open_path`; same messages | Verified (missing path) | S5. Opening an existing file would launch an app, so it isn't automated |
| B11 | `shell.showItemInFolder(path)` | `shell.showItemInFolder` | opener `reveal_item_in_dir` | Verified (missing path) | S5 |
| B12 | `log(level, message)` | `ipcMain.on(LOG)` → electron-log `[renderer:<win>]` | `bridge_log` → tauri-plugin-log, same prefix and file | Verified | E11 scans main.log for `[renderer:x] Uncaught/Unhandled` |
| B13 | The bridge object itself | `contextBridge`, isolated world | frozen, non-configurable property in the page world | Partial | E1 (`Object.isFrozen`). See security §4: there is no isolated world |

### 2.2 Main-process features

| # | Feature | Electron | Tauri | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| M1 | Main-process redux store (source of truth), FunctionLibrary, middleware | Node main process | the same modules in the hidden `core` webview; 11 Node/Electron modules swapped at build time | Verified | E1 to E11 |
| M2 | Store sync to renderers (`forwardToRenderer`, `meta.scope`) | `webContents.send` | `core_broadcast` (sync, ordered) + per-window `target` filter + sequence numbers | Verified | E2, E10 |
| M3 | Persisted state (`electron-json-storage`, `storage/state.json`, `dataToStoreKeyMap`) | electron-json-storage | `tauri-plugin-store` behind an electron-json-storage shim; **byte-compatible file** (`state.json` content is the object) | Verified | E2 and E5 read `<profile>/storage/state.json` |
| M4 | Main window: work-area size, min 500×500, frameless except macOS, shown when ready, re-created when closed | BrowserWindow | WebviewWindow, shown on the bridge's `DOMContentLoaded` (Electron: `ready-to-show`) | Verified | E1 (visible), S1 (closed → `stemn:` link re-creates it) |
| M5 | Frameless drag regions (`-webkit-app-region: drag`) | Chromium CSS | WebKit ignores the property; the bridge starts a native drag on `TitleBar_dragger` / `Header_dragger` and maximises on double click | Partial | Selector-based (the two CSS modules that use it); not automated |
| M6 | Renderer crash recovery (`render-process-gone` → re-create main) | yes | Linux: WebKit `web-process-terminated` → log and reload any window | Implemented (Linux) / Missing (Windows, macOS) | Not tested (needs killing a web process); Tauri exposes no crash hook for WebView2 / WKWebView |
| M7 | Menubar window 330×450, frameless, always on top, skip taskbar, hides on blur (`STEMN_MENUBAR_STAY_OPEN`) | BrowserWindow | WebviewWindow, same options | Verified | E10, S2 |
| M8 | Menubar position next to the tray/cursor (`getTrayPosX/Y`) | yes | ported to `position.rs` (cursor + monitor work area) | Verified (logic) | `position::tests` (4) |
| M9 | Preview windows (80% of the work area, min 1000×600, one per file, `?projectId&fileId&revisionId` / `?localPath`) | `createPreviewWindow` | `windows::create_preview` via `windows_create_preview` | Verified | E8, E9, S1; `windows::preview_uris_like_url_search_params` |
| M10 | Tray icon, tooltip, menu (Open Main / Mini / Website, Preferences, Account Settings enabled only when signed in, Quit); Linux: context menu only; click → menubar, double click → main | `Tray` + `Menu` | `TrayIconBuilder` + menu; the core window reports the login state | Verified (Linux menu) | S2 reads the AppIndicator menu over D-Bus (dbusmenu), checks the items and the disabled Account Settings, clicks Open Mini Window, Preferences, Quit. Clicks on the icon are untested (macOS/Windows only) |
| M11 | Only our pages load; other navigations and `window.open` go to the system browser (http/https/mailto) or are blocked; `<webview>` denied | `will-navigate`, `setWindowOpenHandler`, `will-attach-webview` | `on_navigation`, `on_new_window` (`<webview>` doesn't exist in Tauri) | Verified (navigation); Implemented (window.open) | S5 (`location.href = https://…` stays in the app, URL handed to the opener). WebKit drops scripted popups without a user gesture before the handler runs, so `window.open` wasn't triggerable under WebDriver |
| M12 | `stemn-file://cache/<path>`: serves `<userData>/FileCache` only, CORS, fetchable by pdf.js | `protocol.handle` + `net.fetch` | `register_asynchronous_uri_scheme_protocol` (`http://stemn-file.localhost/cache/` on Windows); traversal-proof resolver; content sniffing | Verified | E9 (pdf.js renders from it), S5 (`..%2F`, `%2E%2E`, other hosts → 404); `cache::tests` and `protocol::tests` (12) |
| M13 | FileCache (`FileCache.get/isCached/remove`, `fileCache.json` index, zip renders extracted and `model.svf/png` renamed, `responseType` path/json) | Node streams, axios, unzipper | Rust (`cache.rs`, reqwest, zip); same index file and format | Verified | E8 (download into `FileCache/`), E9; unit tests incl. the Electron index format and zip slip. Binary `responseType` returns a `Uint8Array` to the core (no caller uses it) |
| M14 | File save with progress (`FileSave.save`: save dialog, download, `FILES/DOWNLOAD_PROGRESS`) | dialog + axios stream | `save_file` (plugin-dialog save, reqwest stream, `stemn:download-progress` events) | Implemented | Needs a native save dialog; the Electron suite doesn't cover it either |
| M15 | Native folder picker | see B8 | | Partial | |
| M16 | `shell.openExternal` from the store (`SystemUtils.openExternal`) | Electron shell | `bridge_open_external` from the core | Implemented | Same command as B9 |
| M17 | Websocket (Primus) in the main process; events to `socketEventMap`; `STEMN_LOG_WEBSOCKET` logging; `websocket` middleware writes | Node | browser WebSocket in the core window, same modules | Verified | E4 (connected, room join, `PROJECT/PROJECT_UPDATED`), E7 (`NEW_COMMITS`) |
| M18 | Local OAuth callback server 127.0.0.1:49554, `/api/auth/{google,dropbox,facebook,linkedin}` → `sendAuthToken`, success page, 30 req/min | express + express-rate-limit | `oauth.rs` (tiny_http) → `stemn:oauth-callback` → the same `sendAuthToken` in the core; `RateLimit` / `Retry-After` headers | Verified | S3 (page, code reaches the core store, 404 for unknown providers, 429 after 30); `oauth::tests` (3). A real provider round trip needs OAuth apps (not tested in either) |
| M19 | `--hidden`, `--path <file>` | `process.argv` | `tauri-plugin-cli` (first instance) + `args::parse_args` (second instance) | Verified | S1; `args::tests` (7) |
| M20 | Single instance; second instance with `--path` opens a preview, otherwise shows main | `requestSingleInstanceLock` (per profile) | `tauri-plugin-single-instance` (+ `deep-link`), per profile on Linux (D-Bus name from `STEMN_USER_DATA_DIR`) | Verified (Linux) / Partial | S1. On Windows and macOS the plugin locks per bundle identifier, so a second *profile* can't run side by side there |
| M21 | `stemn://` protocol handler | electron-builder `protocols`, `setAsDefaultProtocolClient` | `tauri-plugin-deep-link` (installers, Info.plist, `.desktop` `MimeType` + `Exec … %u`, runtime `register_all` for AppImage/Windows) | Verified (handover) / Implemented (registration) | S1 (`stemn:open` second instance → main window). The deb's desktop entry was inspected manually |
| M22 | Auto-start at login with `--hidden` (`AUTO_LAUNCH/TOGGLE`, `GET_STATUS`) | auto-launch | `tauri-plugin-autostart` (same middleware shape) | Verified (Linux) | S4 (XDG autostart entry with `--hidden` written and removed, in a throwaway `HOME`) |
| M23 | Auto update: check on start (setting), download, "Install update" confirm, `quitAndInstall`; dev builds and non-AppImage Linux report "up to date" | electron-updater, GitHub provider (plan: generic feed) | `tauri-plugin-updater`, static `latest.json` in the same feed folder, minisign signatures; same redux actions | Verified (check, download, signature) / Implemented (install) | U1 (local feed → available → downloaded → modal), U2 (bad signature → `UPDATE_ERROR`). Install replaces the running AppImage, so it isn't run in tests |
| M24 | Logging: `<userData>/logs/main.log`, renderer errors, `STEMN_LOG_RENDERER_CONSOLE` console copy | electron-log | tauri-plugin-log (Rust + core window via an electron-log shim); console copy done by the bridge | Verified | E4, E11, U1 read main.log |
| M25 | Crash handlers: uncaught exception → log + error dialog (not in e2e); unhandled rejection → warn; startup error dialog | `process.on` + `dialog.showErrorBox` | core window `error` / `unhandledrejection` → log; no dialog. Rust panics abort (release) | Partial | E11. No error dialog is shown to the user |
| M26 | Provider paths: Dropbox (`info.json`), Google Drive (legacy Backup and Sync `sync_config.db`, sql.js), OneDrive (unused) | Node | Dropbox ported (`system.rs`); Drive and OneDrive report "not installed" | Partial / Missing (Drive) | `system::tests`. Drive's legacy client was discontinued in 2021 and Drive for desktop has no such database, so it wasn't ported (it would need SQLite in Rust) |
| M27 | AppImage desktop-integration status (`getInstallStatus`) | readdir | `system::install_status` | Verified (logic) | `system::desktop_entries` |
| M28 | Windows explorer context menu "View revisions in Stemn" (registry, `--path "%1"`) | winreg | `winreg` crate (`shell_context.rs`, `cfg(windows)`) | Implemented | `cargo check --target x86_64-pc-windows-gnu` passes here, and CI type-checks it on `windows-latest`; `shell_context::tests`. Not run (no Windows host) |
| M29 | Window registry / `ElectronWindowsUtils.create/show/hide/quit/relaunch` | BrowserWindow | `windows_*`, `app_quit`, `app_relaunch` commands | Verified (create, show, quit) / Implemented (hide, relaunch) | E8, E9, S1, S2 (tray Quit) |
| M30 | Keep running in the tray when all windows are closed; macOS dock click re-opens main | `window-all-closed` no-op, `activate` | the core window keeps the app alive (`ExitRequested` prevented); `RunEvent::Reopen` | Verified (Linux) / Implemented (macOS) | S1 |
| M31 | Notifications (`NotificationsUtils.show`, `new Notification`) | the main process has no global `Notification` (it is `electron.Notification`), so this alias throws there | Web Notification in the core webview, no permission granted, so nothing is shown | Equal (non-functional in both) | Code reading; not tested |
| M32 | IPC sender check (`isTrustedSender` by frame URL) | per handler | capabilities bound to window labels and the local origin; Rust stamps the sender label | Verified | E1 (renderer calls to core commands and plugins are refused) |
| M33 | IPC payload cleaning (`toIpcSafe`) | structured clone | the same `toIpcSafe`, then JSON | Partial | `Date` becomes an ISO string and typed arrays become objects (structured clone kept them). No failure seen in E1 to E11 |
| M34 | Mouse back/forward buttons (Windows `app-command`) | yes | no equivalent event in Tauri | Missing | |
| M35 | Dev: Vite dev server + HMR, devtools | electron-vite dev | `tauri dev` with the same renderer config (port 5174) and the core page served by the same server; WebKit inspector in debug builds | Verified (manual) | `npm run tauri:dev` started here and rendered the login page (qa/12-tauri-dev.png) |
| M36 | Sentry (renderers, `SENTRY_DSN`) | renderers | same renderers and CSP | Equal | Unchanged code |
| M37 | Content-Security-Policy | meta tag from `electron.vite.config.ts` | the same policy (taken from that config at build time) + `ipc:` / `http://ipc.localhost` / `http://stemn-file.localhost` | Verified | E1 (meta present, `eval` blocked) |
| M38 | Packaging | AppImage + dir (Linux), NSIS (Windows), dmg + zip (macOS) | AppImage + deb (Linux), NSIS + MSI (Windows), app + dmg (macOS) | Verified (Linux built) / Implemented (Windows, macOS: configured, validated, not built) | `npm run tauri:check` (schema + targets + assets), CI `cargo check` on windows-latest and macos-latest |
| M39 | Squirrel startup handling | electron-squirrel-startup | not needed (no Squirrel installer) | N/A | |

## 3. Measurements (this machine)

Machine: 12 cores, 15 GB RAM, Ubuntu 24.04, X11 (`:1`, i3), WebKitGTK 2.52.6. Both apps were built
with `STEMN_ENV=local` against the running backend. The Electron app ran from `release/linux-unpacked`,
the Tauri app from `target/release/stemn` (system WebKitGTK). Method: `scripts/measure.mjs`, fresh profile
per run, medians of 5 runs (warm OS cache) and of 3 runs with `drop_caches` before each launch (cold).
"First window" is launch to the first visible top-level window (the main window, shown when its page is
ready). "Ready" is launch to `Websocket connected` in main.log: store restored, windows created, websocket
up. Memory is summed over the whole process tree 20 s after start.

| Measure | Electron 45 | Tauri 2 | Difference |
| --- | --- | --- | --- |
| Linux installer | AppImage **125.4 MB** | AppImage **82.4 MB** (bundles WebKitGTK); deb **6.9 MB** (uses the system WebKitGTK 4.1) | −34% / −95% |
| Unpacked / installed size | 293.7 MB (`linux-unpacked`) | 256.9 MB (AppImage AppDir); deb installs 11.4 MB + system `libwebkit2gtk-4.1` | −13% / −96% (excluding the system WebKit) |
| Main binary | 223.6 MB (Electron) + 21 MB `app.asar` | 11.1 MB (web assets embedded) | |
| Time to first window, warm (median of 5) | 1007 ms | 1036 ms | ≈ equal |
| Time to first window, cold cache (median of 3) | 1596 ms | 1505 ms | ≈ equal |
| Start to ready, warm | 588 ms | 679 ms | +15% |
| Start to ready, cold cache | 1000 ms | 1214 ms | +21% |
| Idle memory, signed out: RSS / PSS | 526.6 / 260.8 MB, 5 processes | 894.7 / 427.6 MB, 5 processes | **+64% PSS** |
| Idle memory, signed in (project list loaded): RSS / PSS | 526.7 / 259.5 MB | 901.7 / 438.0 MB | **+69% PSS** |
| Store round trip (renderer dispatch → core store → replayed into the window), median / p90 of 60 | 0.8 / 2.3 ms | 4 / 5 ms (release build) | ×5 |
| Process breakdown, signed in (RSS) | browser 186, zygotes 55 + 56, renderers 147 + 83 | app 204, WebKitNetworkProcess 63, 3 × WebKitWebProcess 185 / 232 / 217 (core, main, menubar) | |

The numbers are in `qa/measurements*.json` (git-ignored). Reading them:

- **Size** is where Tauri wins clearly, especially as a deb that depends on the distribution's WebKitGTK.
  The AppImage has to bundle WebKitGTK, so its advantage shrinks to about a third. Windows (WebView2 is
  part of the OS) and macOS (WKWebView) would be in the deb's range: a single-digit MB binary plus
  installer overhead. That is an estimate; those bundles were not built here.
- **Start-up** is a draw for the first window. "Ready" is slower because the store runs in a webview that
  has to load and parse a 1.3 MB bundle before the websocket connects.
- **Memory is worse with Tauri on Linux.** Each WebKitGTK webview has its own web process, about 200 MB
  RSS each here. The hidden core window costs a whole web process that Electron gets for free in its
  main process. The menubar window, created at start for parity, costs another. Possible ways down: create
  the menubar lazily on first use (about −200 MB RSS; the parity test expects it at start), or move the
  store out of a webview (a large rewrite). On Windows (WebView2 shares a browser process) and macOS the
  picture is likely different, but it was not measured.

## 4. Security comparison

| Aspect | Electron 45 | Tauri 2 (this branch) |
| --- | --- | --- |
| Node in renderers | none (`nodeIntegration: false`) | none (no Node anywhere) |
| Renderer → host API | preload in an **isolated world** (`contextIsolation`); page JS can only call the bridge functions | the bridge lives in the **page world** (frozen). `window.__TAURI_INTERNALS__.invoke` is reachable by any page script, so XSS in a renderer can call every command its **capability** allows, directly. Renderers are limited to the 8 bridge commands plus event listen (`capabilities/renderer.json`), the same surface as Electron's preload. The store, file cache, updater, auto-start and plugin APIs are core-window only. Verified in E1 |
| IPC sender validation | handler checks the frame URL | capabilities per window label and local origin; Rust stamps the sender label on every message to the core |
| OS sandbox of the web content | Chromium sandbox (`sandbox: true`, seccomp-bpf + namespaces, setuid helper), asserted by the Electron e2e | **Linux: none.** wry does not enable WebKitGTK's bubblewrap sandbox, and the WebKitWebProcess children run with `Seccomp: 0` and in the parent's namespaces (checked in `/proc`). macOS (WKWebView) and Windows (WebView2) sandbox their content processes. This is the largest security regression |
| CSP | meta tag, no `unsafe-eval` | the same policy plus IPC origins, no `unsafe-eval` (E1) |
| Navigation / popups | blocked; http(s)/mailto to the browser | same (S5) |
| Local file access | `stemn-file://` confined to FileCache | same, with a stricter resolver and unit tests |
| Update integrity | electron-updater SHA-512 in `latest*.yml` over HTTPS (+ OS code signing when configured) | minisign signature verified against the pinned public key (U2), HTTPS enforced for release endpoints (+ OS code signing when configured) |
| Engine patching | Chromium ships with the app; patched on each app release | the system webview: patched by the OS (Linux distro, Windows Update, macOS), except the AppImage, which freezes the bundled WebKitGTK until the next app release |
| Memory-safe host code | C++ (Chromium) + Node | Rust host; the engine is still C++ (WebKit) |

Optional hardening not done here: Tauri's *isolation pattern* (an iframe that validates every IPC
message) would recover a check similar to the isolated world, at a per-message cost. Every redux action
crosses IPC here, so it would need measuring.

## 5. Known gaps and differences (with reasons)

1. **Memory +65–70% PSS on Linux** (§3). This is structural: one web process per window plus the core
   webview.
2. **No OS-level sandbox for web content on Linux** (§4). It is not exposed by wry/Tauri 2.12, and enabling
   it needs the web context before any webview is created.
3. **The bridge runs in the page world.** Capabilities scope what a compromised page can call (§4).
4. **WebDriver testing is Linux-only.** tauri-driver has no macOS driver, so CI runs the e2e suite on
   Linux, and Windows and macOS are compile-checked only. The Electron suite also runs on Linux only.
5. **Windows and macOS bundles are not built or run.** The configs are schema-validated
   (`tauri:check`), and Rust compiles on Windows (here with the GNU target, in CI on windows-latest) and
   macOS (CI). The macOS SDK isn't available on this machine.
6. **Updater feed format.** Tauri reads `latest.json` and `.sig` files, not electron-updater's
   `latest*.yml`. The release pipeline in `docs/plans/desktop-auto-update-and-signing.md` would publish
   both into the same feed folder. The checked-in public key is a **development key** (README: how to
   generate the production key and the CI secrets). Installing an update was not exercised.
7. **Google Drive legacy path lookup** is not ported (M26): the client has been discontinued since 2021.
8. **No error dialog** on uncaught core errors or at startup; they are logged only (M25).
9. **Drag regions** are emulated for the two CSS modules that declare them (M5). New `-webkit-app-region`
   uses need adding to `src/bridge/dragRegions.ts`.
10. **IPC is JSON.** Dates and binary data don't survive as such (M33).
11. **Single instance per profile only on Linux** (M20). **Mouse back/forward** buttons on Windows are
    missing (M34). The folder picker's **`buttonLabel`** is ignored (B8).
12. **Rendering engine.** The shared UI now runs on WebKit: the e2e scenarios, previews (markdown,
    PDF/pdf.js), forms, CodeMirror and menus work. The Autodesk 3D viewer (WebGL), the PCB viewer and
    broad visual QA were not checked.
13. **A History race in the shared code shows up more often under Tauri timing.** On `PROJECT/NEW_COMMITS`,
    `fetchTimeline` is issued at once but dispatched after the 500 ms `fetch-timeline/project` throttle.
    A storm of `FILES_UPDATED` events shares that throttle key, so the response can land after the
    History page's own fetch and overwrite it with a list from before the commit. Electron has the same
    code and passes by timing. E7 waits for the `NEW_COMMITS` event and then refreshes the list from its
    menu if the commit is missing. Fixing it means changing shared code (`SyncTimeline.actions.ts`),
    which this PR doesn't touch.
14. **Slower store round trip (4 ms vs 0.8 ms median).** Renderer inputs are controlled by the core store, so
    each keystroke goes renderer → core → renderer before the input shows it, exactly as in Electron. If
    keys arrive faster than the round trip, a character can be overwritten. Human typing (about 100 ms
    between keys) is far slower than that. WebDriver typing key by key on a loaded CI runner lost one
    character once. The suite now enters text with one input event, like the Electron suite's
    Playwright `fill`. The proper fix is the same for both shells: apply form input locally first.
15. **Test seams** exist only in the debug `e2e` build: `e2e_windows`, `e2e_show_menubar`,
    `e2e_close_previews` (Electron used `app.evaluate`), the stubbed folder picker, and external URLs
    logged instead of opened. Release builds compile none of it, and the `e2e` capability is off by
    default (`tauri:check` enforces that).

## 6. Recommendation

**Do not replace the Electron shell with this one now. Keep it as a maintained option, and revisit if
installer size or footprint becomes a priority.**

- Functional parity is close: all 11 Electron scenarios pass against the Tauri app with the same
  outcomes, and so do 7 more tests for updates and shell features plus 38 Rust unit tests. That was done
  with zero changes to renderer or shared code.
- The wins are distribution size (a 6.9 MB deb, a 34% smaller AppImage, and probably small Windows and
  macOS installers) and a Rust host with explicit per-window capabilities.
- The costs on Linux, the platform measured here, are higher idle memory (+170 MB PSS), slightly slower
  readiness, and the loss of the renderer OS sandbox. There is also a second rendering engine to QA
  across three platform webviews (WebKitGTK, WebView2, WKWebView) instead of one bundled Chromium.
- If the founder wants to go further, in this order: (1) build and measure Windows and macOS in CI
  (where the memory and size story may favour Tauri), (2) create the menubar lazily and measure again,
  (3) evaluate the isolation pattern, (4) decide. The store-in-a-webview design keeps that decision
  cheap, because both shells run the same app code.

## 7. How to reproduce

```sh
# from the repo root, backend running (stemn-backend/local), X display :1
npm install
npm run tauri:test                                    # Rust unit tests + 18 WebDriver tests
npm run desktop:test:e2e                              # the Electron suite (unchanged, 11 tests)
STEMN_ENV=local npm run package --workspace stemn-frontend-desktop
STEMN_ENV=local npm run tauri:build                   # TMPDIR=<exec-able dir> if /tmp is noexec
node stemn-frontend-tauri/scripts/measure.mjs --runs 5 [--drop-caches]
```
