//! Windows explorer context menu ("View revisions in Stemn") for files in the Dropbox / Drive
//! folders: a port of stemn-shared/desktop/Shell/ShellContext (winreg) to the `winreg` crate.
//! The entry runs `stemn.exe --path "%1"`, which opens a preview window (see args.rs).
//! Other platforms have no equivalent and report `false` like the Electron app never enabling it.

#![cfg_attr(not(windows), allow(dead_code))]

pub const TITLE: &str = "View revisions in Stemn";
pub const APP_NAME: &str = "Stemn";

/// The AppliesTo filter: `(C:\Dropbox) OR (E:\Google Drive)`
pub fn applies_to(folders: &[String]) -> String {
    folders
        .iter()
        .filter(|f| !f.is_empty())
        .map(|f| format!("({f})"))
        .collect::<Vec<_>>()
        .join(" OR ")
}

pub fn command_line(exe: &str) -> String {
    format!("\"{exe}\" --path \"%1\"")
}

#[cfg(windows)]
mod imp {
    use super::*;
    use winreg::enums::HKEY_CURRENT_USER;
    use winreg::RegKey;

    fn key() -> String {
        format!(r"Software\Classes\*\shell\{APP_NAME}")
    }

    fn exe() -> Result<String, String> {
        std::env::current_exe().map(|p| p.display().to_string()).map_err(|e| e.to_string())
    }

    pub fn enable(folders: &[String]) -> Result<bool, String> {
        let exe = exe()?;
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let (shell, _) = hkcu.create_subkey(key()).map_err(|e| e.to_string())?;
        shell.set_value("AppliesTo", &applies_to(folders)).map_err(|e| e.to_string())?;
        shell.set_value("Icon", &format!("{exe},0")).map_err(|e| e.to_string())?;
        shell.set_value("", &TITLE).map_err(|e| e.to_string())?;
        let (command, _) = hkcu.create_subkey(format!(r"{}\command", key())).map_err(|e| e.to_string())?;
        command.set_value("", &command_line(&exe)).map_err(|e| e.to_string())?;
        Ok(true)
    }

    pub fn disable() -> Result<bool, String> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        match hkcu.delete_subkey_all(key()) {
            Ok(()) => Ok(true),
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(true),
            Err(error) => Err(error.to_string()),
        }
    }

    pub fn is_enabled(folders: &[String]) -> Result<bool, String> {
        let exe = exe()?;
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let Ok(shell) = hkcu.open_subkey(key()) else { return Ok(false) };
        let applies: String = shell.get_value("AppliesTo").unwrap_or_default();
        let Ok(command) = hkcu.open_subkey(format!(r"{}\command", key())) else { return Ok(false) };
        let line: String = command.get_value("").unwrap_or_default();
        Ok(applies == applies_to(folders) && line == command_line(&exe))
    }
}

#[cfg(not(windows))]
mod imp {
    pub fn enable(_folders: &[String]) -> Result<bool, String> {
        Ok(false)
    }
    pub fn disable() -> Result<bool, String> {
        Ok(false)
    }
    pub fn is_enabled(_folders: &[String]) -> Result<bool, String> {
        Ok(false)
    }
}

pub use imp::{disable, enable, is_enabled};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn applies_to_filter() {
        assert_eq!(applies_to(&[]), "");
        assert_eq!(applies_to(&["C:\\Dropbox".into()]), "(C:\\Dropbox)");
        assert_eq!(
            applies_to(&["C:\\Dropbox".into(), "".into(), "E:\\Google Drive".into()]),
            "(C:\\Dropbox) OR (E:\\Google Drive)"
        );
    }

    #[test]
    fn quoted_command_line() {
        assert_eq!(
            command_line("C:\\Program Files\\Stemn\\stemn.exe"),
            "\"C:\\Program Files\\Stemn\\stemn.exe\" --path \"%1\""
        );
        // and our own parser reads it back
        let args = crate::args::parse_args(["C:\\Program Files\\Stemn\\stemn.exe", "--path", "C:\\Dropbox\\a b.step"]);
        assert_eq!(args.path.as_deref(), Some("C:\\Dropbox\\a b.step"));
    }
}
