//! Test seams for the WebDriver suite (cargo feature `e2e`, never in release packages):
//! window introspection that WebDriver can't do (native visibility) and window actions the
//! Electron suite performs with `app.evaluate` in the main process.
use serde::Serialize;
use tauri::{AppHandle, Manager};

#[derive(Serialize)]
pub struct WindowInfo {
    label: String,
    url: String,
    visible: bool,
    title: String,
}

#[tauri::command]
pub fn e2e_windows(app: AppHandle) -> Vec<WindowInfo> {
    let mut windows: Vec<WindowInfo> = app
        .webview_windows()
        .into_iter()
        .map(|(label, window)| WindowInfo {
            url: window.url().map(|u| u.to_string()).unwrap_or_default(),
            visible: window.is_visible().unwrap_or(false),
            title: window.title().unwrap_or_default(),
            label,
        })
        .collect();
    windows.sort_by(|a, b| a.label.cmp(&b.label));
    windows
}

#[tauri::command]
pub fn e2e_show_menubar(app: AppHandle) {
    crate::windows::show_menubar(&app, true);
}

#[tauri::command]
pub fn e2e_close_previews(app: AppHandle) {
    for (label, window) in app.webview_windows() {
        if label.starts_with(crate::windows::PREVIEW_PREFIX) {
            let _ = window.close();
        }
    }
}
