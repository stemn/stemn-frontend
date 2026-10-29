//! Stemn Desktop, Tauri 2 shell. See ../README.md and ../PARITY.md.
//!
//! Process model: Rust replaces the Electron main process for everything native (windows, tray,
//! dialogs, the file cache and its `stemn-file:` protocol, the OAuth callback server, launch
//! arguments, single instance, auto-start, updates, logging). The JavaScript half of the Electron
//! main process (the redux store that is the source of truth, the FunctionLibrary, the websocket
//! client) runs unchanged in a hidden `core` webview. The three renderers are the Electron app's own
//! renderers; `window.stemnDesktop` is provided by an initialization script (src/bridge) instead
//! of the preload script.
mod args;
mod cache;
mod commands;
#[cfg(feature = "e2e")]
mod e2e;
mod http;
mod oauth;
mod position;
mod protocol;
mod shell_context;
mod state;
mod system;
mod tray;
mod windows;

use std::path::PathBuf;
use tauri::{AppHandle, Emitter, Manager, RunEvent};
use tauri_plugin_cli::CliExt;
use tauri_plugin_log::{RotationStrategy, Target, TargetKind};

macro_rules! handlers {
    ($($extra:path),*) => {
        tauri::generate_handler![
            commands::bridge_window_command,
            commands::bridge_select_directory,
            commands::bridge_open_external,
            commands::bridge_open_path,
            commands::bridge_show_item_in_folder,
            commands::bridge_log,
            commands::bridge_to_core,
            commands::bridge_window_ready,
            commands::core_launch_info,
            commands::core_broadcast,
            commands::core_send,
            commands::core_configure,
            commands::cache_get,
            commands::cache_is_cached,
            commands::cache_remove,
            commands::save_file,
            commands::provider_path,
            commands::install_status,
            commands::windows_create_preview,
            commands::windows_show,
            commands::windows_hide,
            commands::app_quit,
            commands::app_relaunch,
            commands::tray_set_logged_in,
            commands::shell_context,
            commands::updater_supported,
            commands::updater_check,
            commands::updater_download,
            commands::updater_install,
            $($extra),*
        ]
    };
}

fn profile_override() -> Option<PathBuf> {
    std::env::var_os("STEMN_USER_DATA_DIR").filter(|v| !v.is_empty()).map(PathBuf::from)
}

/// A second instance was started: preview its --path, else bring the main window up
fn on_second_instance(app: &AppHandle, argv: Vec<String>) {
    let args = args::parse_args(&argv);
    log::info!("Second instance flags: {args:?}");
    match args.path {
        Some(path) => open_local_path_preview(app, &path),
        None => windows::show_main(app),
    }
}

/// Electron: dispatch(createWindow({ type: 'PREVIEW', props: { localPath } }))
fn open_local_path_preview(app: &AppHandle, local_path: &str) {
    log::info!("path to show preview {local_path}");
    let mut props = serde_json::Map::new();
    props.insert("localPath".into(), local_path.into());
    if let Err(error) = windows::create_preview(app, &windows::preview_uri(&props)) {
        log::error!("Could not open the preview window: {error}");
    }
}

fn launch_args(app: &tauri::App) -> args::LaunchArgs {
    match app.cli().matches() {
        Ok(matches) => {
            let values = matches.args.into_iter().map(|(name, data)| (name, data.value)).collect();
            args::from_cli_matches(&values)
        }
        Err(error) => {
            // e.g. arguments added by a launcher: fall back to the lenient Electron-style parser
            log::warn!("Could not parse the command line ({error}), using the raw arguments");
            args::parse_args(std::env::args())
        }
    }
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let profile_dir = match profile_override() {
        Some(dir) => dir,
        None => app.path().app_data_dir()?,
    };
    std::fs::create_dir_all(profile_dir.join("storage"))?;
    let launch = launch_args(app);
    let dev_url = if tauri::is_dev() { app.config().build.dev_url.clone() } else { None };
    log::info!(
        "Stemn Desktop {} starting (Tauri {}, {} {}, profile {})",
        app.package_info().version,
        tauri::VERSION,
        windows::node_platform(),
        tauri::webview_version().unwrap_or_default(),
        profile_dir.display()
    );
    log::info!("Start flags: {launch:?}");
    app.manage(state::AppState::new(profile_dir, launch.clone(), dev_url));

    let handle = app.handle().clone();
    // The store first (it answers the windows' getInitialState), then the windows and the tray
    windows::create_core(&handle)?;
    windows::create_main(&handle, "/")?;
    windows::create_menubar(&handle)?;
    if let Err(error) = tray::create(&handle) {
        // e.g. no system tray on this desktop
        log::warn!("Could not create the tray icon: {error}");
    }
    if let Some(path) = launch.path.as_deref() {
        open_local_path_preview(&handle, path);
    }

    // OAuth callbacks from the system browser -> sendAuthToken in the core store
    let oauth_app = handle.clone();
    oauth::start(move |callback| {
        let _ = oauth_app.emit_to(windows::CORE, "stemn:oauth-callback", callback);
    });

    // stemn:// links open the app (installers register it; AppImages and Windows need it at runtime)
    #[cfg(any(windows, target_os = "linux"))]
    if !tauri::is_dev() {
        use tauri_plugin_deep_link::DeepLinkExt;
        if let Err(error) = app.deep_link().register_all() {
            log::warn!("Could not register the stemn:// protocol handler: {error}");
        }
    }
    Ok(())
}

pub fn run() {
    let log_target = match profile_override() {
        Some(dir) => TargetKind::Folder { path: dir.join("logs"), file_name: Some("main".into()) },
        None => TargetKind::LogDir { file_name: Some("main".into()) },
    };

    #[allow(unused_mut)]
    let mut single_instance = tauri_plugin_single_instance::Builder::new().callback(|app, argv, _cwd| on_second_instance(app, argv));
    // Electron's single-instance lock lives in the profile folder, so a second profile
    // (STEMN_USER_DATA_DIR: tests, a second dev instance) runs side by side. Same on Linux here
    // (one D-Bus name per profile); Windows/macOS lock on the bundle identifier only.
    #[cfg(target_os = "linux")]
    if let Some(dir) = profile_override() {
        use std::hash::{Hash, Hasher};
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        dir.hash(&mut hasher);
        single_instance = single_instance.dbus_id(format!("com.stemn.desktop.profile{:x}", hasher.finish()));
    }

    let builder = tauri::Builder::default()
        // must be the first plugin
        .plugin(single_instance.build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([Target::new(log_target), Target::new(TargetKind::Stdout)])
                .level(log::LevelFilter::Info)
                .max_file_size(5_000_000)
                .rotation_strategy(RotationStrategy::KeepOne)
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .build(),
        )
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--hidden"]),
        ))
        .plugin(tauri_plugin_updater::Builder::new().build())
        .register_asynchronous_uri_scheme_protocol(cache::SCHEME, protocol::handle)
        .setup(setup);

    #[cfg(feature = "e2e")]
    let builder = builder.invoke_handler(handlers!(e2e::e2e_windows, e2e::e2e_show_menubar, e2e::e2e_close_previews));
    #[cfg(not(feature = "e2e"))]
    let builder = builder.invoke_handler(handlers!());

    builder
        .build(tauri::generate_context!())
        .expect("error while building the Stemn Tauri app")
        .run(|_app, event| match event {
            // Keep running in the tray when every window is closed (the core window never is)
            RunEvent::ExitRequested { api, code: None, .. } => api.prevent_exit(),
            // macOS: re-open the main window when the dock icon is clicked (Electron: 'activate')
            #[cfg(target_os = "macos")]
            RunEvent::Reopen { .. } => windows::show_main(_app),
            _ => {}
        });
}
