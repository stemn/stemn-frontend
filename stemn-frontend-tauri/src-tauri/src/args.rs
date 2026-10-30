//! Launch arguments, the Tauri equivalent of `getArgs` in stemn-frontend-desktop/app/main/index.js.
//!
//! `--hidden` starts the app in the tray without showing the main window (auto-start uses it) and
//! `--path <file>` opens a preview window with the revisions of a local file (the Windows explorer
//! context menu passes it). `stemn:` deep links only bring the app to the front.
//!
//! The first instance reads its arguments through tauri-plugin-cli (see `from_cli_matches`); a second
//! instance's argv arrives raw through tauri-plugin-single-instance and is parsed with `parse_args`.
//! Both produce the same `LaunchArgs`.
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;

#[derive(Debug, Default, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchArgs {
    pub hidden: bool,
    pub path: Option<String>,
    pub deep_link: Option<String>,
}

fn is_deep_link(arg: &str) -> bool {
    arg.to_ascii_lowercase().starts_with("stemn:")
}

/// Parse a full argv (program name included, like `process.argv` / the single-instance callback).
/// Matches the Electron behaviour: `--path` takes the next argument, `--hidden` anywhere.
/// `--path=<file>` (the form tauri-plugin-cli accepts) works too.
pub fn parse_args<I, S>(argv: I) -> LaunchArgs
where
    I: IntoIterator<Item = S>,
    S: AsRef<str>,
{
    let argv: Vec<String> = argv.into_iter().map(|arg| arg.as_ref().to_string()).collect();
    let mut args = LaunchArgs::default();
    let mut index = 0;
    while index < argv.len() {
        let arg = argv[index].as_str();
        if arg == "--hidden" {
            args.hidden = true;
        } else if arg == "--path" {
            if let Some(value) = argv.get(index + 1) {
                if !value.is_empty() {
                    args.path = Some(value.clone());
                }
                index += 1;
            }
        } else if let Some(value) = arg.strip_prefix("--path=") {
            if !value.is_empty() {
                args.path = Some(value.to_string());
            }
        } else if index > 0 && is_deep_link(arg) && args.deep_link.is_none() {
            args.deep_link = Some(arg.to_string());
        }
        index += 1;
    }
    args
}

/// Convert tauri-plugin-cli matches (`plugins.cli` in tauri.conf.json: `hidden`, `path`, `url`).
pub fn from_cli_matches(args: &HashMap<String, Value>) -> LaunchArgs {
    let string = |name: &str| match args.get(name) {
        Some(Value::String(value)) if !value.is_empty() => Some(value.clone()),
        _ => None,
    };
    LaunchArgs {
        hidden: matches!(args.get("hidden"), Some(Value::Bool(true))),
        path: string("path"),
        deep_link: string("url").filter(|url| is_deep_link(url)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn no_arguments() {
        assert_eq!(parse_args(["stemn"]), LaunchArgs::default());
        assert_eq!(parse_args(Vec::<String>::new()), LaunchArgs::default());
    }

    #[test]
    fn hidden_flag_anywhere() {
        assert!(parse_args(["stemn", "--hidden"]).hidden);
        assert!(parse_args(["stemn", "--path", "/a.md", "--hidden"]).hidden);
        assert!(!parse_args(["stemn", "--hiddenx"]).hidden);
    }

    #[test]
    fn path_takes_the_next_argument() {
        let args = parse_args(["C:\\Stemn\\stemn.exe", "--path", "C:\\Dropbox\\Project\\part.sldprt"]);
        assert_eq!(args.path.as_deref(), Some("C:\\Dropbox\\Project\\part.sldprt"));
        // paths with spaces arrive as one argument (the registry command quotes "%1")
        let args = parse_args(["stemn", "--path", "/home/a/Dropbox/My Project/file.md"]);
        assert_eq!(args.path.as_deref(), Some("/home/a/Dropbox/My Project/file.md"));
        // a value starting with -- is still taken, like process.argv[index + 1] in Electron
        assert_eq!(parse_args(["stemn", "--path", "--hidden"]).path.as_deref(), Some("--hidden"));
    }

    #[test]
    fn path_equals_form() {
        assert_eq!(parse_args(["stemn", "--path=/tmp/x.pdf"]).path.as_deref(), Some("/tmp/x.pdf"));
    }

    #[test]
    fn dangling_or_empty_path_is_ignored() {
        assert_eq!(parse_args(["stemn", "--path"]).path, None);
        assert_eq!(parse_args(["stemn", "--path", ""]).path, None);
        assert_eq!(parse_args(["stemn", "--path="]).path, None);
    }

    #[test]
    fn deep_links() {
        let args = parse_args(["stemn", "stemn:open"]);
        assert_eq!(args.deep_link.as_deref(), Some("stemn:open"));
        assert_eq!(args.path, None);
        assert_eq!(parse_args(["STEMN://x"]).deep_link, None, "argv[0] is the program");
        assert_eq!(parse_args(["stemn", "STEMN://x"]).deep_link.as_deref(), Some("STEMN://x"));
    }

    #[test]
    fn cli_matches() {
        let mut matches = HashMap::new();
        matches.insert("hidden".to_string(), json!(true));
        matches.insert("path".to_string(), json!("/tmp/a.md"));
        matches.insert("url".to_string(), json!(null));
        assert_eq!(
            from_cli_matches(&matches),
            LaunchArgs { hidden: true, path: Some("/tmp/a.md".into()), deep_link: None }
        );
        matches.insert("hidden".to_string(), json!(false));
        matches.insert("path".to_string(), json!(null));
        matches.insert("url".to_string(), json!("stemn:open"));
        assert_eq!(
            from_cli_matches(&matches),
            LaunchArgs { hidden: false, path: None, deep_link: Some("stemn:open".into()) }
        );
        matches.insert("url".to_string(), json!("https://example.com"));
        assert_eq!(from_cli_matches(&matches).deep_link, None);
    }
}
