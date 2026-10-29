//! Host lookups behind FunctionLibrary aliases: ProviderPathUtils.getPath and
//! SystemUtils.getInstallStatus (stemn-shared/desktop/ProviderPath, System/System.utils.js).
use std::path::{Path, PathBuf};

fn home() -> PathBuf {
    std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" })
        .map(PathBuf::from)
        .unwrap_or_default()
}

/// Dropbox writes its folder(s) to info.json: { personal: { path }, business: { path } }
pub fn dropbox_info_path() -> PathBuf {
    if cfg!(windows) {
        std::env::var_os("LOCALAPPDATA")
            .map(PathBuf::from)
            .unwrap_or_default()
            .join("Dropbox")
            .join("info.json")
    } else {
        home().join(".dropbox").join("info.json")
    }
}

pub fn parse_dropbox_info(json: &str) -> Result<String, String> {
    let config: serde_json::Value = serde_json::from_str(json).map_err(|e| e.to_string())?;
    let account = config.get("personal").or_else(|| config.get("business"));
    account
        .and_then(|account| account.get("path"))
        .and_then(|path| path.as_str())
        .map(str::to_string)
        .ok_or_else(|| "Dropbox info.json has no account path".to_string())
}

/// ProviderPathUtils.getPath(provider). Errors mirror the Electron messages
/// ("Dropbox not installed locally"), which the System reducer treats as "not installed".
pub fn provider_path(provider: &str) -> Result<String, String> {
    match provider {
        "dropbox" => {
            let info = std::fs::read_to_string(dropbox_info_path()).map_err(|_| "Dropbox not installed locally".to_string())?;
            parse_dropbox_info(&info)
        }
        // The Electron app reads the legacy Google "Backup and Sync" SQLite database
        // (sync_config.db, Windows/macOS only). That client was discontinued in 2021 and
        // "Drive for desktop" has no such file, so it is not ported (see PARITY.md).
        "drive" => Err("Drive not installed locally".to_string()),
        "onedrive" => Err("OneDrive not installed locally".to_string()),
        other => Err(format!("Unknown provider {other}")),
    }
}

/// Linux AppImages must be integrated with the desktop (a .desktop entry) for the stemn:// handler
/// and the launcher; every other build is installed by its installer.
pub fn install_status() -> bool {
    if !cfg!(target_os = "linux") || std::env::var_os("APPIMAGE").is_none() {
        return true;
    }
    has_desktop_entry(&home().join(".local/share/applications"))
}

pub fn has_desktop_entry(folder: &Path) -> bool {
    std::fs::read_dir(folder)
        .map(|entries| {
            entries.filter_map(|e| e.ok()).any(|entry| {
                let name = entry.file_name().to_string_lossy().to_lowercase();
                name.contains("stemn") && name.ends_with(".desktop")
            })
        })
        .unwrap_or(false)
}

pub fn is_external_url(url: &str) -> bool {
    let lower = url.trim_start().to_ascii_lowercase();
    lower.starts_with("http://") || lower.starts_with("https://") || lower.starts_with("mailto:")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dropbox_personal_then_business() {
        assert_eq!(parse_dropbox_info(r#"{"personal":{"path":"/home/a/Dropbox"}}"#).unwrap(), "/home/a/Dropbox");
        assert_eq!(
            parse_dropbox_info(r#"{"business":{"path":"C:\\Users\\a\\Dropbox (Stemn)"}}"#).unwrap(),
            "C:\\Users\\a\\Dropbox (Stemn)"
        );
        assert!(parse_dropbox_info("{}").is_err());
        assert!(parse_dropbox_info("not json").is_err());
    }

    #[test]
    fn missing_providers_are_not_installed() {
        assert_eq!(provider_path("drive").unwrap_err(), "Drive not installed locally");
        assert!(provider_path("box").is_err());
    }

    #[test]
    fn desktop_entries() {
        let dir = tempfile::tempdir().unwrap();
        assert!(!has_desktop_entry(dir.path()));
        std::fs::write(dir.path().join("appimagekit_123-Stemn.desktop"), "").unwrap();
        assert!(has_desktop_entry(dir.path()));
        assert!(!has_desktop_entry(&dir.path().join("missing")));
    }

    #[test]
    fn external_urls() {
        assert!(is_external_url("https://stemn.com"));
        assert!(is_external_url("HTTP://x"));
        assert!(is_external_url("mailto:a@b.c"));
        assert!(!is_external_url("file:///etc/passwd"));
        assert!(!is_external_url("javascript:alert(1)"));
        assert!(!is_external_url("stemn-file://cache/x"));
        assert!(!is_external_url("smb://host/share"));
    }
}
