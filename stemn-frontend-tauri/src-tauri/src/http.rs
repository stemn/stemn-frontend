//! One HTTP client (reqwest + rustls with the ring provider, the same stack tauri-plugin-updater uses)
use std::sync::OnceLock;

pub fn client() -> &'static reqwest::Client {
    static CLIENT: OnceLock<reqwest::Client> = OnceLock::new();
    CLIENT.get_or_init(|| {
        if rustls::crypto::CryptoProvider::get_default().is_none() {
            let _ = rustls::crypto::ring::default_provider().install_default();
        }
        reqwest::Client::builder()
            .user_agent(concat!("StemnDesktop/", env!("CARGO_PKG_VERSION"), " (Tauri)"))
            .build()
            .expect("HTTP client")
    })
}
