//! Commands. `bridge_*` back the `window.stemnDesktop` bridge of the renderer windows (one per
//! preload function, like the IPC handlers in stemn-frontend-desktop/app/main/ipc.js); the others are
//! the FunctionLibrary functions the core window (the store) calls. Which window may call what is
//! decided by the capabilities in src-tauri/capabilities.
use crate::cache::{ApiContext, CacheRequest};
use crate::state::{AppState, PendingUpdate};
use crate::{system, tray, windows};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::path::Path;
use tauri::{AppHandle, Emitter, Manager, State, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_updater::UpdaterExt;

type CmdResult<T> = Result<T, String>;

fn err(error: impl std::fmt::Display) -> String {
    error.to_string()
}

// ---------------------------------------------------------------- bridge (renderer windows)

/// window.minimize / toggleMaximize / close / isMaximized (+ startDragging for the drag regions)
#[tauri::command]
pub fn bridge_window_command(window: WebviewWindow, command: String) -> CmdResult<bool> {
    match command.as_str() {
        "minimize" => window.minimize().map_err(err)?,
        "toggleMaximize" => {
            if window.is_maximized().map_err(err)? {
                window.unmaximize().map_err(err)?
            } else {
                window.maximize().map_err(err)?
            }
        }
        "close" => {
            window.close().map_err(err)?;
            return Ok(false);
        }
        "startDragging" => window.start_dragging().map_err(err)?,
        "isMaximized" => {}
        other => return Err(format!("Unknown window command: {other}")),
    }
    window.is_maximized().map_err(err)
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DirectoryOptions {
    pub title: Option<String>,
    pub default_path: Option<String>,
    /// Not supported by the GTK / Windows / macOS folder pickers that tauri-plugin-dialog uses
    pub button_label: Option<String>,
}

/// dialog.selectDirectory: the native folder picker, resolves with the path or null
#[tauri::command]
pub async fn bridge_select_directory(
    app: AppHandle,
    window: WebviewWindow,
    options: Option<DirectoryOptions>,
) -> CmdResult<Option<String>> {
    #[cfg(feature = "e2e")]
    if let Ok(folder) = std::env::var("STEMN_E2E_DIALOG_RESULT") {
        log::info!("e2e: folder picker stubbed with {folder}");
        return Ok(Some(folder).filter(|f| !f.is_empty()));
    }
    let options = options.unwrap_or_default();
    let _ = &options.button_label;
    let mut dialog = app.dialog().file().set_parent(&window);
    if let Some(title) = options.title.filter(|t| !t.is_empty()) {
        dialog = dialog.set_title(title);
    }
    if let Some(path) = options.default_path.filter(|p| !p.is_empty() && Path::new(p).is_dir()) {
        dialog = dialog.set_directory(path);
    }
    let (tx, rx) = tokio::sync::oneshot::channel();
    dialog.pick_folder(move |folder| {
        let _ = tx.send(folder);
    });
    let folder = rx.await.map_err(err)?;
    Ok(folder.and_then(|f| f.into_path().ok()).map(|p| p.display().to_string()))
}

/// shell.openExternal (http, https and mailto only)
#[tauri::command]
pub fn bridge_open_external(app: AppHandle, url: String) -> CmdResult<()> {
    if !system::is_external_url(&url) {
        return Err(format!("Refusing to open {url}"));
    }
    windows::open_in_browser(&app, &url)
}

/// shell.openPath: resolves with an error message, '' on success
#[tauri::command]
pub fn bridge_open_path(app: AppHandle, path: String) -> String {
    if path.is_empty() {
        return "No path".into();
    }
    if !Path::new(&path).exists() {
        return format!("{path} does not exist");
    }
    match app.opener().open_path(path, None::<&str>) {
        Ok(()) => String::new(),
        Err(error) => error.to_string(),
    }
}

/// shell.showItemInFolder: false if the path does not exist
#[tauri::command]
pub fn bridge_show_item_in_folder(app: AppHandle, path: String) -> bool {
    if path.is_empty() || !Path::new(&path).exists() {
        return false;
    }
    app.opener().reveal_item_in_dir(path).is_ok()
}

/// log(level, message): renderer errors in the main log (`[renderer:main] ...`). `source: 'console'`
/// is the copy of console warnings/errors (STEMN_LOG_RENDERER_CONSOLE).
#[tauri::command]
pub fn bridge_log(window: WebviewWindow, level: String, message: String, source: Option<String>) {
    let name = windows::window_name(window.label()).unwrap_or("unknown");
    let prefix = if source.as_deref() == Some("console") { "console" } else { "renderer" };
    if level == "error" {
        log::error!(target: "renderer", "[{prefix}:{name}] {message}");
    } else {
        log::warn!(target: "renderer", "[{prefix}:{name}] {message}");
    }
}

/// Every message from a renderer to the store (dispatchToMain, forwardToWindow, getInitialState).
/// Rust adds the sender's label, so a window can't pretend to be another one. Synchronous commands
/// run on the main thread in arrival order; the payload's `seq` lets the core reorder anything that
/// still arrives out of order (see src/shared/sequencer.ts).
#[tauri::command]
pub fn bridge_to_core(app: AppHandle, window: WebviewWindow, mut payload: Value) -> CmdResult<()> {
    let Value::Object(map) = &mut payload else {
        return Err("Invalid message".into());
    };
    map.insert("from".into(), Value::String(window.label().to_string()));
    app.emit_to(tauri::EventTarget::webview_window(windows::CORE), "stemn:to-core", payload).map_err(err)
}

/// The core store replays an action (or forwards one) to the renderer windows. Each window's bridge
/// filters on `target` ('main' | 'menubar' | 'preview', none = all) and orders by `seq`.
#[tauri::command]
pub fn core_broadcast(app: AppHandle, payload: Value) -> CmdResult<()> {
    app.emit_filter("stemn:to-renderer", payload, |target| match target {
        tauri::EventTarget::WebviewWindow { label } => label != windows::CORE,
        _ => false,
    })
    .map_err(err)
}

/// A message for one window (the reply to its getInitialState)
#[tauri::command]
pub fn core_send(app: AppHandle, label: String, payload: Value) -> CmdResult<()> {
    if label == windows::CORE || windows::window_name(&label).is_none() {
        return Err(format!("Unknown window {label}"));
    }
    app.emit_to(tauri::EventTarget::webview_window(&label), "stemn:to-renderer", payload).map_err(err)
}

/// The page of a renderer window has loaded (Electron: ready-to-show)
#[tauri::command]
pub fn bridge_window_ready(app: AppHandle, window: WebviewWindow) {
    windows::on_renderer_ready(&app, &window);
}

// ---------------------------------------------------------------- core window (the store)

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchInfo {
    profile_dir: String,
    storage_dir: String,
    args: crate::args::LaunchArgs,
    is_dev: bool,
    version: String,
}

#[tauri::command]
pub fn core_launch_info(app: AppHandle, state: State<'_, AppState>) -> LaunchInfo {
    LaunchInfo {
        profile_dir: state.profile_dir.display().to_string(),
        storage_dir: state.profile_dir.join("storage").display().to_string(),
        args: state.launch.clone(),
        is_dev: tauri::is_dev(),
        version: app.package_info().version.to_string(),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CoreConfig {
    website_url: String,
}

#[tauri::command]
pub fn core_configure(state: State<'_, AppState>, config: CoreConfig) {
    *state.website_url.lock().unwrap() = Some(config.website_url);
}

#[tauri::command]
pub async fn cache_get(state: State<'_, AppState>, request: CacheRequest, api: ApiContext) -> CmdResult<Value> {
    state.cache.get(request, api).await
}

#[tauri::command]
pub fn cache_is_cached(state: State<'_, AppState>, key: String) -> bool {
    state.cache.is_cached(&key)
}

#[tauri::command]
pub fn cache_remove(state: State<'_, AppState>, key: String) -> bool {
    state.cache.remove(&key)
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct DownloadProgress {
    file_url: String,
    progress: f64,
}

/// FileSave.save: ask where to save `fileUrl` (defaulting to `filePath`) and download it there,
/// reporting progress to the core window (`stemn:download-progress` -> downloadProgress actions)
#[tauri::command]
pub async fn save_file(
    app: AppHandle,
    file_url: String,
    file_path: Option<String>,
    api: ApiContext,
) -> CmdResult<Option<Value>> {
    use futures_util::StreamExt;
    let mut dialog = app.dialog().file();
    if let Some(window) = app.webview_windows().into_values().find(|w| w.is_focused().unwrap_or(false)) {
        dialog = dialog.set_parent(&window);
    }
    if let Some(path) = file_path.as_deref().filter(|p| !p.is_empty()).map(Path::new) {
        if let Some(parent) = path.parent().filter(|p| p.is_dir()) {
            dialog = dialog.set_directory(parent);
        }
        if let Some(name) = path.file_name() {
            dialog = dialog.set_file_name(name.to_string_lossy());
        }
    }
    let (tx, rx) = tokio::sync::oneshot::channel();
    dialog.save_file(move |dest| {
        let _ = tx.send(dest);
    });
    let Some(dest) = rx.await.map_err(err)?.and_then(|d| d.into_path().ok()) else {
        return Ok(None);
    };
    let progress = |value: f64| {
        let _ = app.emit_to(windows::CORE, "stemn:download-progress", DownloadProgress { file_url: file_url.clone(), progress: value });
    };
    progress(0.0);
    let url = crate::cache::api_url(&api.api_server, &file_url)?;
    let mut request = crate::http::client().get(&url);
    if let Some(token) = api.token.as_deref().filter(|t| !t.is_empty()) {
        request = request.header("Authorization", format!("bearer {token}"));
    }
    let response = request.send().await.map_err(err)?;
    if !response.status().is_success() {
        return Err(format!("GET {url} failed: {}", response.status()));
    }
    let total = response.content_length();
    let mut file = tokio::fs::File::create(&dest).await.map_err(err)?;
    let mut size = 0u64;
    let mut last_reported = 0.0;
    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = match chunk {
            Ok(chunk) => chunk,
            Err(error) => {
                drop(file);
                let _ = tokio::fs::remove_file(&dest).await;
                return Err(error.to_string());
            }
        };
        size += chunk.len() as u64;
        tokio::io::AsyncWriteExt::write_all(&mut file, &chunk).await.map_err(err)?;
        if let Some(total) = total.filter(|t| *t > 0) {
            let value = size as f64 / total as f64 * 100.0;
            if value - last_reported >= 1.0 {
                last_reported = value;
                progress(value);
            }
        }
    }
    tokio::io::AsyncWriteExt::flush(&mut file).await.map_err(err)?;
    progress(100.0);
    Ok(Some(serde_json::json!({ "size": total.unwrap_or(size) })))
}

#[tauri::command]
pub fn provider_path(provider: String) -> CmdResult<String> {
    system::provider_path(&provider)
}

#[tauri::command]
pub fn install_status() -> bool {
    system::install_status()
}

/// ElectronWindowsUtils.create({ type: 'PREVIEW', props }). Window-creating commands are async:
/// a synchronous command runs on the main thread, where creating a webview can deadlock (Windows).
#[tauri::command]
pub async fn windows_create_preview(app: AppHandle, props: Option<serde_json::Map<String, Value>>) -> CmdResult<()> {
    let uri = windows::preview_uri(&props.unwrap_or_default());
    windows::create_preview(&app, &uri).map(|_| ()).map_err(err)
}

/// ElectronWindowsUtils.show / hide ('main' | 'menubar')
#[tauri::command]
pub async fn windows_show(app: AppHandle, window: String) -> CmdResult<()> {
    match window.as_str() {
        "main" => windows::show_main(&app),
        "menubar" => windows::show_menubar(&app, false),
        other => return Err(format!("Window {other} could not be found")),
    }
    Ok(())
}

#[tauri::command]
pub fn windows_hide(app: AppHandle, window: String) -> CmdResult<()> {
    match app.get_webview_window(&window).filter(|_| window == "main" || window == "menubar") {
        Some(w) => w.hide().map_err(err),
        None => Err(format!("Window {window} could not be found")),
    }
}

#[tauri::command]
pub fn app_quit(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn app_relaunch(app: AppHandle) {
    app.restart();
}

#[tauri::command]
pub fn tray_set_logged_in(app: AppHandle, logged_in: bool) {
    tray::set_logged_in(&app, logged_in);
}

#[tauri::command]
pub fn shell_context(action: String, folders: Option<Vec<String>>) -> CmdResult<bool> {
    let folders = folders.unwrap_or_default();
    match action.as_str() {
        "enable" => crate::shell_context::enable(&folders),
        "disable" => crate::shell_context::disable(),
        "isEnabled" => crate::shell_context::is_enabled(&folders),
        other => Err(format!("Unknown action {other}")),
    }
}

// ---------------------------------------------------------------- updater

/// Like electron-updater: development builds, and Linux builds other than the AppImage (deb), can't
/// update themselves and report "up to date". STEMN_UPDATES_URL (a test or staging feed) forces it on.
#[tauri::command]
pub fn updater_supported() -> bool {
    if std::env::var_os("STEMN_UPDATES_URL").is_some() {
        return true;
    }
    !cfg!(debug_assertions) && (!cfg!(target_os = "linux") || std::env::var_os("APPIMAGE").is_some())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateInfo {
    version: String,
    current_version: String,
    release_notes: String,
    platform: &'static str,
}

fn updater(app: &AppHandle) -> CmdResult<tauri_plugin_updater::Updater> {
    let mut builder = app.updater_builder();
    if let Ok(url) = std::env::var("STEMN_UPDATES_URL") {
        builder = builder.endpoints(vec![url.parse().map_err(err)?]).map_err(err)?;
    }
    #[cfg(feature = "e2e")]
    if let Ok(pubkey) = std::env::var("STEMN_UPDATES_PUBKEY") {
        builder = builder.pubkey(pubkey);
    }
    builder.build().map_err(err)
}

#[tauri::command]
pub async fn updater_check(app: AppHandle, state: State<'_, AppState>) -> CmdResult<Option<UpdateInfo>> {
    let update = updater(&app)?.check().await.map_err(err)?;
    let info = update.as_ref().map(|u| UpdateInfo {
        version: u.version.clone(),
        current_version: u.current_version.clone(),
        release_notes: u.body.clone().unwrap_or_default(),
        platform: windows::node_platform(),
    });
    *state.update.lock().unwrap() = update.map(|update| PendingUpdate { update, bytes: None });
    Ok(info)
}

/// Download (and verify the minisign signature of) the update found by updater_check
#[tauri::command]
pub async fn updater_download(state: State<'_, AppState>) -> CmdResult<()> {
    let update = state.update.lock().unwrap().as_ref().map(|p| p.update.clone()).ok_or("No update available")?;
    let bytes = update.download(|_, _| {}, || {}).await.map_err(err)?;
    if let Some(pending) = state.update.lock().unwrap().as_mut() {
        pending.bytes = Some(bytes);
    }
    Ok(())
}

/// AutoUpdateUtils.installUpdates (Electron: quitAndInstall)
#[tauri::command]
pub fn updater_install(app: AppHandle, state: State<'_, AppState>) -> CmdResult<()> {
    let pending = state.update.lock().unwrap().take().ok_or("No update downloaded")?;
    let bytes = pending.bytes.ok_or("The update has not been downloaded")?;
    pending.update.install(bytes).map_err(err)?;
    app.restart();
}
