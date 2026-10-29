//! Windows: the Tauri equivalents of stemn-frontend-desktop/app/main/{windows,createMainWindow,
//! createMenuBarWindow,createPreviewWindow}.js, plus the hidden `core` window.
//!
//! * `core`     hidden, runs the redux store that is the source of truth (Electron: the main process
//!              store), the websocket client and the FunctionLibrary (see src/core in the package)
//! * `main`     the full app (frameless except on macOS, the renderer draws the title bar)
//! * `menubar`  the popover next to the tray icon (hides when it loses focus)
//! * `preview-<n>` one window per previewed file
//!
//! Every renderer window gets the bridge (`window.stemnDesktop`, the Electron preload) as an
//! initialization script, may only load our own pages (other navigations and window.open go to the
//! system browser) and talks to Rust only through the commands its capability allows.
use crate::state::AppState;
use crate::system::is_external_url;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_opener::OpenerExt;

pub const CORE: &str = "core";
pub const MAIN: &str = "main";
pub const MENUBAR: &str = "menubar";
pub const PREVIEW_PREFIX: &str = "preview-";

/// The bridge bundle (src/bridge, built by `npm run build:bridge`)
const BRIDGE_JS: &str = include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/../dist-bridge/stemn-bridge.js"));

/// Scope name of a window label: 'main' | 'menubar' | 'preview' | 'core'
pub fn window_name(label: &str) -> Option<&'static str> {
    match label {
        MAIN => Some("main"),
        MENUBAR => Some("menubar"),
        CORE => Some("core"),
        _ if label.starts_with(PREVIEW_PREFIX) => Some("preview"),
        _ => None,
    }
}

/// Node's process.platform for the host
pub fn node_platform() -> &'static str {
    match std::env::consts::OS {
        "windows" => "win32",
        "macos" => "darwin",
        other => other,
    }
}

/// Is this url one of our own pages (bundled assets or the dev server)?
pub fn is_app_url(url: &tauri::Url, dev_url: Option<&tauri::Url>) -> bool {
    let local = match url.scheme() {
        "tauri" => url.host_str() == Some("localhost"),
        "http" | "https" => url.host_str() == Some("tauri.localhost"),
        _ => false,
    };
    local || dev_url.is_some_and(|dev| dev.origin() == url.origin())
}

fn bool_env(name: &str) -> bool {
    std::env::var(name).map(|v| !v.is_empty() && v != "0" && v != "false").unwrap_or(false)
}

fn init_script(label: &str) -> String {
    let info = serde_json::json!({
        "label": label,
        "windowName": window_name(label),
        "platform": node_platform(),
        "versions": {
            "electron": "",
            "chrome": "",
            "node": "",
            "tauri": tauri::VERSION,
            "webview": tauri::webview_version().unwrap_or_default(),
        },
        "logRendererConsole": bool_env("STEMN_LOG_RENDERER_CONSOLE"),
        "logWebsocket": bool_env("STEMN_LOG_WEBSOCKET"),
    });
    let globals = format!(
        "Object.defineProperty(window, '__STEMN_TAURI__', {{ value: Object.freeze({info}), writable: false, configurable: false }});"
    );
    if label == CORE {
        // The core page is not a renderer: it only needs the platform (normaliseSlashes, getPlatform)
        format!("{globals}\nObject.defineProperty(window, 'stemnDesktop', {{ value: Object.freeze({{ platform: '{}' }}), writable: false, configurable: false }});", node_platform())
    } else {
        format!("{globals}\n{BRIDGE_JS}")
    }
}

/// Page path for a renderer entry with an optional hash route (`loadRenderer` in the Electron app)
pub fn page_path(entry: &str, hash: &str) -> String {
    let route = hash.trim_start_matches('#');
    if route.is_empty() {
        format!("{entry}/index.html")
    } else {
        format!("{entry}/index.html#{route}")
    }
}

fn builder<'a>(app: &'a AppHandle, label: &str, path: String) -> WebviewWindowBuilder<'a, tauri::Wry, AppHandle> {
    let state = app.state::<AppState>();
    let dev_url = state.dev_url.clone();
    let dev_url_nav = dev_url.clone();
    let nav_app = app.clone();
    let new_window_app = app.clone();
    WebviewWindowBuilder::new(app, label, WebviewUrl::App(path.into()))
        .visible(false)
        .data_directory(state.profile_dir.join("WebView"))
        .initialization_script(init_script(label))
        .on_navigation(move |url| {
            if is_app_url(url, dev_url_nav.as_ref()) || url.scheme() == "about" {
                return true;
            }
            open_external_safely(&nav_app, url.as_str());
            false
        })
        .on_new_window(move |url, _features| {
            open_external_safely(&new_window_app, url.as_str());
            tauri::webview::NewWindowResponse::Deny
        })
}

pub fn open_external_safely(app: &AppHandle, url: &str) {
    if is_external_url(url) {
        if let Err(error) = open_in_browser(app, url) {
            log::warn!("openExternal failed {url}: {error}");
        }
    } else {
        log::warn!("Blocked opening url {url}");
    }
}

/// Hand a url to the system browser (e2e builds only log it, so tests never open a browser)
pub fn open_in_browser(app: &AppHandle, url: &str) -> Result<(), String> {
    log::info!("Opening {url} in the system browser");
    if cfg!(feature = "e2e") {
        let _ = app;
        return Ok(());
    }
    app.opener().open_url(url, None::<&str>).map_err(|e| e.to_string())
}

/// Recreate/reload renderers whose web process died (Electron: render-process-gone)
#[allow(unused_variables)]
fn watch_crashes(window: &WebviewWindow, label: &str) {
    #[cfg(target_os = "linux")]
    {
        let label = label.to_string();
        let _ = window.with_webview(move |webview| {
            use webkit2gtk::{WebViewExt, WebProcessTerminationReason};
            let label = label.clone();
            webview.inner().connect_web_process_terminated(move |view, reason| {
                let reason_name = match reason {
                    WebProcessTerminationReason::Crashed => "crashed",
                    WebProcessTerminationReason::ExceededMemoryLimit => "oom",
                    WebProcessTerminationReason::TerminatedByApi => "killed",
                    _ => "unknown",
                };
                log::error!("Renderer of the {label} window is gone: {reason_name}");
                if reason != WebProcessTerminationReason::TerminatedByApi {
                    view.reload();
                }
            });
        });
    }
}

fn primary_work_area(app: &AppHandle) -> (f64, f64) {
    app.primary_monitor()
        .ok()
        .flatten()
        .map(|monitor| {
            let area = monitor.work_area();
            let scale = monitor.scale_factor();
            (area.size.width as f64 / scale, area.size.height as f64 / scale)
        })
        .unwrap_or((1280.0, 800.0))
}

pub fn create_core(app: &AppHandle) -> tauri::Result<WebviewWindow> {
    let window = builder(app, CORE, "core/index.html".to_string())
        .title("Stemn Core")
        .inner_size(400.0, 300.0)
        .skip_taskbar(true)
        .focused(false)
        .build()?;
    watch_crashes(&window, CORE);
    Ok(window)
}

pub fn create_main(app: &AppHandle, uri: &str) -> tauri::Result<WebviewWindow> {
    let (width, height) = primary_work_area(app);
    let window = builder(app, MAIN, page_path("main", uri))
        .title("Stemn")
        .inner_size(width, height)
        .min_inner_size(500.0, 500.0)
        // The renderer draws its own title bar except on macOS
        .decorations(cfg!(target_os = "macos"))
        .build()?;
    watch_crashes(&window, MAIN);
    Ok(window)
}

/// Show (recreating it if it was closed), restore and focus the main window
pub fn show_main(app: &AppHandle) {
    let window = match app.get_webview_window(MAIN) {
        Some(window) => window,
        None => match create_main(app, "/") {
            Ok(window) => {
                // shown once its page is ready, like a fresh start
                app.state::<AppState>().show_main_on_ready.store(true, Ordering::SeqCst);
                return drop(window);
            }
            Err(error) => return log::error!("Could not create the main window: {error}"),
        },
    };
    if window.is_minimized().unwrap_or(false) {
        let _ = window.unminimize();
    }
    let _ = window.show();
    let _ = window.set_focus();
}

pub fn create_menubar(app: &AppHandle) -> tauri::Result<WebviewWindow> {
    let window = builder(app, MENUBAR, page_path("menubar", "/"))
        .title("Stemn")
        .inner_size(crate::position::WINDOW_WIDTH, crate::position::WINDOW_HEIGHT)
        .decorations(false)
        .always_on_top(true)
        .resizable(false)
        .skip_taskbar(true)
        .build()?;
    watch_crashes(&window, MENUBAR);
    // Behave like a popover: hide when it loses focus (STEMN_MENUBAR_STAY_OPEN keeps it open for tests)
    let stay_open = bool_env("STEMN_MENUBAR_STAY_OPEN");
    let handle = window.clone();
    window.on_window_event(move |event| {
        if let WindowEvent::Focused(false) = event {
            if !stay_open {
                let _ = handle.hide();
            }
        }
    });
    Ok(window)
}

pub fn show_menubar(app: &AppHandle, reposition: bool) {
    let window = match app.get_webview_window(MENUBAR) {
        Some(window) => window,
        None => match create_menubar(app) {
            Ok(window) => window,
            Err(error) => return log::error!("Could not create the menubar window: {error}"),
        },
    };
    let state = app.state::<AppState>();
    if reposition || !state.menubar_positioned.load(Ordering::SeqCst) {
        if let Ok(cursor) = app.cursor_position() {
            let monitor = app.monitor_from_point(cursor.x, cursor.y).ok().flatten().or_else(|| app.primary_monitor().ok().flatten());
            if let Some(monitor) = monitor {
                let scale = monitor.scale_factor();
                let area = monitor.work_area();
                let origin = (area.position.x as f64 / scale, area.position.y as f64 / scale);
                let size = crate::position::Size { width: area.size.width as f64 / scale, height: area.size.height as f64 / scale };
                let point = crate::position::Point { x: cursor.x / scale - origin.0, y: cursor.y / scale - origin.1 };
                let (x, y) = crate::position::menubar_position(point, size);
                let _ = window.set_position(tauri::LogicalPosition::new(x as f64 + origin.0, y as f64 + origin.1));
                state.menubar_positioned.store(true, Ordering::SeqCst);
            }
        }
    }
    let _ = window.show();
    let _ = window.set_focus();
}

/// A preview window. `uri` is the hash route, e.g. `/?projectId=..&fileId=..&revisionId=..`
pub fn create_preview(app: &AppHandle, uri: &str) -> tauri::Result<WebviewWindow> {
    let state = app.state::<AppState>();
    let label = format!("{PREVIEW_PREFIX}{}", state.preview_seq.fetch_add(1, Ordering::SeqCst) + 1);
    let (width, height) = primary_work_area(app);
    log::info!("Opening the preview window {label} ({uri})");
    let window = builder(app, &label, page_path("preview", uri))
        .title("Stemn Preview")
        .inner_size((width * 0.8).round(), (height * 0.8).round())
        .min_inner_size(width.min(1000.0), height.min(600.0))
        .decorations(cfg!(target_os = "macos"))
        .build()?;
    watch_crashes(&window, &label);
    Ok(window)
}

/// ElectronWindowsUtils.create({ type: 'PREVIEW', props }) -> hash route `/?<props>`
pub fn preview_uri(props: &serde_json::Map<String, serde_json::Value>) -> String {
    let mut query = url::form_urlencoded::Serializer::new(String::new());
    for (key, value) in props {
        match value {
            serde_json::Value::Null => {}
            serde_json::Value::String(s) => {
                query.append_pair(key, s);
            }
            other => {
                query.append_pair(key, &other.to_string());
            }
        }
    }
    let query = query.finish();
    if query.is_empty() {
        "/".to_string()
    } else {
        format!("/?{query}")
    }
}

/// Called by the bridge when a renderer page has loaded (Electron: 'ready-to-show')
pub fn on_renderer_ready(app: &AppHandle, window: &WebviewWindow) {
    let label = window.label();
    if label == MAIN {
        let state = app.state::<AppState>();
        if state.show_main_on_ready.swap(false, Ordering::SeqCst) {
            show_main(app);
        }
    } else if label.starts_with(PREVIEW_PREFIX) {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn window_names() {
        assert_eq!(window_name("main"), Some("main"));
        assert_eq!(window_name("menubar"), Some("menubar"));
        assert_eq!(window_name("preview-12"), Some("preview"));
        assert_eq!(window_name("core"), Some("core"));
        assert_eq!(window_name("other"), None);
    }

    #[test]
    fn app_urls() {
        let dev = tauri::Url::parse("http://localhost:5174/").unwrap();
        let ok = |u: &str| is_app_url(&tauri::Url::parse(u).unwrap(), Some(&dev));
        assert!(ok("tauri://localhost/main/index.html#/"));
        assert!(ok("http://tauri.localhost/preview/index.html"));
        assert!(ok("http://localhost:5174/main/index.html"));
        assert!(!ok("http://localhost:3000/"));
        assert!(!ok("https://stemn.com/"));
        assert!(!ok("tauri://evil/main/index.html"));
        assert!(!ok("file:///etc/passwd"));
        assert!(!is_app_url(&tauri::Url::parse("http://localhost:5174/").unwrap(), None));
    }

    #[test]
    fn page_paths() {
        assert_eq!(page_path("main", "/"), "main/index.html#/");
        assert_eq!(page_path("main", ""), "main/index.html");
        assert_eq!(page_path("preview", "#/?fileId=1"), "preview/index.html#/?fileId=1");
    }

    #[test]
    fn preview_uris_like_url_search_params() {
        let props: serde_json::Map<String, serde_json::Value> =
            serde_json::from_str(r#"{"projectId":"p1","fileId":"f 1","revisionId":null}"#).unwrap();
        assert_eq!(preview_uri(&props), "/?projectId=p1&fileId=f+1");
        let local: serde_json::Map<String, serde_json::Value> =
            serde_json::from_str(r#"{"localPath":"C:\\Dropbox\\a.md"}"#).unwrap();
        assert_eq!(preview_uri(&local), "/?localPath=C%3A%5CDropbox%5Ca.md");
        assert_eq!(preview_uri(&serde_json::Map::new()), "/");
    }
}
