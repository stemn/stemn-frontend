//! Declares the app's own commands so that each one gets an `allow-<command>` permission and is
//! only callable by the windows whose capability (src-tauri/capabilities/*.json) grants it.
const COMMANDS: &[&str] = &[
    // window.stemnDesktop bridge (renderer windows)
    "bridge_window_command",
    "bridge_select_directory",
    "bridge_open_external",
    "bridge_open_path",
    "bridge_show_item_in_folder",
    "bridge_log",
    "bridge_to_core",
    "bridge_window_ready",
    // core window: FunctionLibrary functions and the store's host services
    "core_launch_info",
    "core_broadcast",
    "core_send",
    "core_configure",
    "cache_get",
    "cache_is_cached",
    "cache_remove",
    "save_file",
    "provider_path",
    "install_status",
    "windows_create_preview",
    "windows_show",
    "windows_hide",
    "app_quit",
    "app_relaunch",
    "tray_set_logged_in",
    "shell_context",
    "updater_supported",
    "updater_check",
    "updater_download",
    "updater_install",
    // cargo feature `e2e` only (the handlers are not compiled into release builds)
    "e2e_windows",
    "e2e_show_menubar",
    "e2e_close_previews",
];

fn main() {
    let bridge = std::path::Path::new("../dist-bridge/stemn-bridge.js");
    println!("cargo:rerun-if-changed=../dist-bridge/stemn-bridge.js");
    if !bridge.exists() {
        panic!("{} is missing: run `npm run build:bridge` in stemn-frontend-tauri first", bridge.display());
    }
    tauri_build::try_build(
        tauri_build::Attributes::new().app_manifest(tauri_build::AppManifest::new().commands(COMMANDS)),
    )
    .expect("tauri build script");
}
