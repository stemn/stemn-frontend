//! State managed by the Tauri app (the Electron main process kept the same in module globals)
use crate::cache::FileCache;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, AtomicU32};
use std::sync::Mutex;

pub struct AppState {
    /// `STEMN_USER_DATA_DIR` or the app data dir: storage/, FileCache/, WebView/ (and logs/ with the override)
    pub profile_dir: PathBuf,
    pub cache: FileCache,
    pub launch: crate::args::LaunchArgs,
    /// Show the main window once its page has loaded (not in --hidden mode)
    pub show_main_on_ready: AtomicBool,
    pub menubar_positioned: AtomicBool,
    pub preview_seq: AtomicU32,
    /// Set by the core window (GLOBAL_ENV.WEBSITE_URL) for the tray's "Open Website"
    pub website_url: Mutex<Option<String>>,
    pub account_item: Mutex<Option<tauri::menu::MenuItem<tauri::Wry>>>,
    pub dev_url: Option<tauri::Url>,
    pub update: Mutex<Option<PendingUpdate>>,
}

pub struct PendingUpdate {
    pub update: tauri_plugin_updater::Update,
    pub bytes: Option<Vec<u8>>,
}

impl AppState {
    pub fn new(profile_dir: PathBuf, launch: crate::args::LaunchArgs, dev_url: Option<tauri::Url>) -> Self {
        AppState {
            cache: FileCache::new(&profile_dir),
            profile_dir,
            show_main_on_ready: AtomicBool::new(!launch.hidden),
            launch,
            menubar_positioned: AtomicBool::new(false),
            preview_seq: AtomicU32::new(0),
            website_url: Mutex::new(None),
            account_item: Mutex::new(None),
            dev_url,
            update: Mutex::new(None),
        }
    }
}
