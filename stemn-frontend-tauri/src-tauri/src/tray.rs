//! Tray icon and menu: a port of stemn-frontend-desktop/app/main/createTrayIcon.js.
//! Linux (AppIndicator) only shows the menu and emits no click events, like Electron.
use crate::state::AppState;
use crate::windows;
use tauri::image::Image;
use tauri::menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager};

const ICON: &[u8] = include_bytes!("../../../stemn-frontend-desktop/app/static/images/logo@2x.png");

/// Show the main window on a route. A live window is navigated through the core store
/// (`sendToWindow('main', push({ pathname }))`), a closed one is recreated on that route.
fn navigate_main(app: &AppHandle, pathname: &str) {
    if app.get_webview_window(windows::MAIN).is_some() {
        windows::show_main(app);
        let _ = app.emit_to(windows::CORE, "stemn:navigate-main", serde_json::json!({ "pathname": pathname }));
    } else if let Err(error) = windows::create_main(app, pathname) {
        log::error!("Could not create the main window: {error}");
    } else {
        app.state::<AppState>().show_main_on_ready.store(true, std::sync::atomic::Ordering::SeqCst);
    }
}

fn on_menu_event(app: &AppHandle, event: MenuEvent) {
    match event.id().as_ref() {
        "open-main" => windows::show_main(app),
        "open-mini" => windows::show_menubar(app, true),
        "open-website" => {
            let url = app.state::<AppState>().website_url.lock().unwrap().clone();
            match url {
                Some(url) => windows::open_external_safely(app, &url),
                None => log::warn!("The website url is not known yet"),
            }
        }
        "preferences" => navigate_main(app, "/settings/application"),
        "account" => navigate_main(app, "/settings/account"),
        "quit" => app.exit(0),
        _ => {}
    }
}

pub fn create(app: &AppHandle) -> tauri::Result<()> {
    let account = MenuItem::with_id(app, "account", "Account Settings", false, None::<&str>)?;
    let menu = Menu::with_items(
        app,
        &[
            &MenuItem::with_id(app, "open-main", "Open Main Window", true, None::<&str>)?,
            &MenuItem::with_id(app, "open-mini", "Open Mini Window", true, None::<&str>)?,
            &MenuItem::with_id(app, "open-website", "Open Website", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "preferences", "Preferences", true, None::<&str>)?,
            &account,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?,
        ],
    )?;
    *app.state::<AppState>().account_item.lock().unwrap() = Some(account);

    TrayIconBuilder::with_id("stemn")
        .icon(Image::from_bytes(ICON)?)
        .tooltip("Stemn Desktop")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(on_menu_event)
        .on_tray_icon_event(|tray, event| {
            let app = tray.app_handle();
            match event {
                TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } => {
                    windows::show_menubar(app, true)
                }
                TrayIconEvent::DoubleClick { button: MouseButton::Left, .. } => windows::show_main(app),
                _ => {}
            }
        })
        .build(app)?;
    Ok(())
}

/// "Account Settings" is only enabled when signed in (the core store tells us)
pub fn set_logged_in(app: &AppHandle, logged_in: bool) {
    if let Some(item) = app.state::<AppState>().account_item.lock().unwrap().as_ref() {
        let _ = item.set_enabled(logged_in);
    }
}
