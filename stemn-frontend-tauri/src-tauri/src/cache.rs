//! The file cache: a port of stemn-shared/desktop/FileCache (FileCache.js, lib/downloadToDisk.js,
//! lib/renameFiles.js) and of the `stemn-file://` url helpers in
//! stemn-frontend-desktop/app/main/protocol.js.
//!
//! Files are downloaded from the Stemn API into `<profile>/FileCache/<name>` (zips, e.g. 3D renders,
//! are extracted into a folder of that name) and recorded in `<profile>/storage/fileCache.json`
//! (`{ [key]: { timestamp, name, size } }`, the same file and format as the Electron app).
//! `responseType: 'path'` resolves with a `stemn-file://cache/<name>` url the previews can load,
//! served by `protocol.rs`, which only reads inside the cache folder.
use percent_encoding::{percent_decode_str, utf8_percent_encode, AsciiSet, NON_ALPHANUMERIC};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::path::{Component, Path, PathBuf};
use std::sync::Mutex;

pub const SCHEME: &str = "stemn-file";
/// Host (Linux/macOS) or first path segment (Windows/Android, `http://stemn-file.localhost/cache/..`)
const CACHE_HOST: &str = "cache";

/// encodeURIComponent: everything but A-Z a-z 0-9 - _ . ! ~ * ' ( )
const URI_COMPONENT: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'_')
    .remove(b'.')
    .remove(b'!')
    .remove(b'~')
    .remove(b'*')
    .remove(b'\'')
    .remove(b'(')
    .remove(b')');

/// Url of a path relative to the cache folder (`toCacheUrl` in the Electron app). WebView2 (Windows)
/// and Android expose custom schemes as `http://<scheme>.localhost/`.
pub fn cache_url(relative_path: &str) -> String {
    let encoded: Vec<String> = relative_path
        .split(['/', '\\'])
        .filter(|segment| !segment.is_empty())
        .map(|segment| utf8_percent_encode(segment, URI_COMPONENT).to_string())
        .collect();
    let encoded = encoded.join("/");
    if cfg!(any(windows, target_os = "android")) {
        format!("http://{SCHEME}.localhost/{CACHE_HOST}/{encoded}")
    } else {
        format!("{SCHEME}://{CACHE_HOST}/{encoded}")
    }
}

fn is_safe_segment(segment: &str) -> bool {
    !segment.is_empty()
        && segment != "."
        && segment != ".."
        && !segment.contains(['/', '\\', '\0', ':'])
}

/// The file a `stemn-file:` request asks for, or None if it is not inside `folder`.
/// Accepts `stemn-file://cache/<path>` and `http://stemn-file.localhost/cache/<path>`.
pub fn resolve_request_path(folder: &Path, uri: &str) -> Option<PathBuf> {
    let url = url::Url::parse(uri).ok()?;
    let host = url.host_str()?;
    let path = url.path();
    let relative = if url.scheme() == SCHEME && host == CACHE_HOST {
        path.trim_start_matches('/')
    } else if host == format!("{SCHEME}.localhost") {
        path.strip_prefix(&format!("/{CACHE_HOST}/"))?
    } else {
        return None;
    };
    let mut file = folder.to_path_buf();
    let mut segments = 0;
    for raw in relative.split('/').filter(|segment| !segment.is_empty()) {
        let segment = percent_decode_str(raw).decode_utf8().ok()?;
        if !is_safe_segment(&segment) {
            return None;
        }
        file.push(segment.as_ref());
        segments += 1;
    }
    if segments == 0 {
        return None;
    }
    // Belt and braces: the joined path must still be inside the folder
    let inside = file.strip_prefix(folder).ok()?;
    if inside.components().any(|c| !matches!(c, Component::Normal(_))) {
        return None;
    }
    Some(file)
}

/// Content type for a cached file: from the extension (extracted renders), else from the magic
/// bytes (downloads are stored under their cache key, without an extension).
pub fn content_type(path: &Path, head: &[u8]) -> &'static str {
    let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_ascii_lowercase();
    match extension.as_str() {
        "pdf" => return "application/pdf",
        "png" => return "image/png",
        "jpg" | "jpeg" => return "image/jpeg",
        "gif" => return "image/gif",
        "svg" => return "image/svg+xml",
        "json" => return "application/json",
        "txt" | "md" => return "text/plain; charset=utf-8",
        _ => {}
    }
    if head.starts_with(b"%PDF") {
        "application/pdf"
    } else if head.starts_with(b"\x89PNG\r\n\x1a\n") {
        "image/png"
    } else if head.starts_with(&[0xff, 0xd8, 0xff]) {
        "image/jpeg"
    } else if head.starts_with(b"GIF87a") || head.starts_with(b"GIF89a") {
        "image/gif"
    } else if head.len() >= 12 && &head[0..4] == b"RIFF" && &head[8..12] == b"WEBP" {
        "image/webp"
    } else {
        "application/octet-stream"
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CacheEntry {
    pub timestamp: Value,
    pub name: String,
    /// A number, or the content-length header string (as written by the Electron app)
    pub size: Value,
}

/// `FileCache.get` inputs (functionInputs of the FILES/GET_FILE and FILES/RENDER_FILE_DOWNLOAD actions)
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CacheRequest {
    pub key: String,
    pub url: String,
    #[serde(default)]
    pub params: Option<Map<String, Value>>,
    pub name: String,
    #[serde(default)]
    pub response_type: Option<String>,
    #[serde(default)]
    pub extract: Option<bool>,
}

/// Where to download from: the API server and the user's token (both from the core store)
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiContext {
    pub api_server: String,
    #[serde(default)]
    pub token: Option<String>,
}

/// Resolve an API url like axios with `baseURL: API_SERVER + '/'` would. Absolute urls must point at the API server.
pub fn api_url(api_server: &str, url: &str) -> Result<String, String> {
    let base = api_server.trim_end_matches('/');
    if url.starts_with("http://") || url.starts_with("https://") {
        if url == base || url.starts_with(&format!("{base}/")) {
            return Ok(url.to_string());
        }
        return Err(format!("Refusing to download {url}: not on the API server"));
    }
    Ok(format!("{base}/{}", url.trim_start_matches('/')))
}

/// Query string pairs for axios-style `params` (null values are skipped like axios does)
pub fn query_pairs(params: &Option<Map<String, Value>>) -> Vec<(String, String)> {
    let mut pairs = Vec::new();
    if let Some(params) = params {
        for (key, value) in params {
            match value {
                Value::Null => {}
                Value::String(s) => pairs.push((key.clone(), s.clone())),
                other => pairs.push((key.clone(), other.to_string())),
            }
        }
    }
    pairs
}

/// Rename the first `.svf` / `.png` in each part folder of an extracted render to `model.svf` /
/// `model.png` (lib/renameFiles.js)
pub fn rename_render_files(dest: &Path) -> std::io::Result<()> {
    for part in std::fs::read_dir(dest)? {
        let part = part?.path();
        if !part.is_dir() {
            continue;
        }
        let names: Vec<String> = std::fs::read_dir(&part)?
            .filter_map(|e| e.ok().and_then(|e| e.file_name().into_string().ok()))
            .collect();
        for extension in ["svf", "png"] {
            let target = format!("model.{extension}");
            if names.iter().any(|n| n == &target) {
                continue;
            }
            for name in names.iter().filter(|n| n.ends_with(&format!(".{extension}"))) {
                std::fs::rename(part.join(name), part.join(&target))?;
            }
        }
    }
    Ok(())
}

/// Extract a zip into `dest` (entries escaping the folder are skipped)
pub fn extract_zip(zip_path: &Path, dest: &Path) -> Result<(), String> {
    let file = std::fs::File::open(zip_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;
    std::fs::create_dir_all(dest).map_err(|e| e.to_string())?;
    for index in 0..archive.len() {
        let mut entry = archive.by_index(index).map_err(|e| e.to_string())?;
        let Some(relative) = entry.enclosed_name() else {
            log::warn!("Skipping unsafe zip entry {}", entry.name());
            continue;
        };
        let out = dest.join(relative);
        if entry.is_dir() {
            std::fs::create_dir_all(&out).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = out.parent() {
                std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let mut buffer = Vec::new();
            entry.read_to_end(&mut buffer).map_err(|e| e.to_string())?;
            std::fs::File::create(&out)
                .and_then(|mut f| f.write_all(&buffer))
                .map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

pub struct FileCache {
    folder: PathBuf,
    index_file: PathBuf,
    index: Mutex<Option<HashMap<String, CacheEntry>>>,
}

impl FileCache {
    pub fn new(profile_dir: &Path) -> Self {
        FileCache {
            folder: profile_dir.join("FileCache"),
            index_file: profile_dir.join("storage").join("fileCache.json"),
            index: Mutex::new(None),
        }
    }

    pub fn folder(&self) -> &Path {
        &self.folder
    }

    fn with_index<T>(&self, f: impl FnOnce(&mut HashMap<String, CacheEntry>) -> T) -> T {
        let mut guard = self.index.lock().unwrap();
        if guard.is_none() {
            let loaded = std::fs::read_to_string(&self.index_file)
                .ok()
                .and_then(|text| serde_json::from_str(&text).ok())
                .unwrap_or_default();
            *guard = Some(loaded);
        }
        f(guard.as_mut().unwrap())
    }

    fn save_index(&self) {
        let json = self.with_index(|index| serde_json::to_string(index).unwrap_or_else(|_| "{}".into()));
        if let Some(parent) = self.index_file.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        if let Err(error) = std::fs::write(&self.index_file, json) {
            log::error!("Could not save the file cache index: {error}");
        }
    }

    pub fn entry(&self, key: &str) -> Option<CacheEntry> {
        self.with_index(|index| index.get(key).cloned())
    }

    pub fn is_cached(&self, key: &str) -> bool {
        self.entry(key).is_some()
    }

    pub fn record(&self, key: &str, name: &str, size: u64) {
        self.with_index(|index| {
            index.insert(
                key.to_string(),
                CacheEntry {
                    timestamp: Value::String(chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true)),
                    name: name.to_string(),
                    size: Value::from(size),
                },
            )
        });
        self.save_index();
    }

    pub fn remove(&self, key: &str) -> bool {
        let removed = self.with_index(|index| index.remove(key));
        match removed {
            Some(entry) => {
                let path = self.folder.join(&entry.name);
                let _ = if path.is_dir() { std::fs::remove_dir_all(path) } else { std::fs::remove_file(path) };
                self.save_index();
                true
            }
            None => false,
        }
    }

    /// Total recorded size (checkSpace in the Electron app; nothing is evicted there either)
    #[cfg_attr(not(test), allow(dead_code))]
    pub fn total_size(&self) -> u64 {
        self.with_index(|index| {
            index
                .values()
                .map(|e| match &e.size {
                    Value::Number(n) => n.as_u64().unwrap_or(0),
                    Value::String(s) => s.parse().unwrap_or(0),
                    _ => 0,
                })
                .sum()
        })
    }

    /// The result for a cached entry: a stemn-file url, the file as a string ('json') or bytes
    pub fn read_result(&self, name: &str, response_type: Option<&str>) -> Result<Value, String> {
        if response_type == Some("path") {
            return Ok(Value::String(cache_url(name)));
        }
        let bytes = std::fs::read(self.folder.join(name)).map_err(|e| e.to_string())?;
        if response_type == Some("json") {
            return Ok(Value::String(String::from_utf8_lossy(&bytes).into_owned()));
        }
        Ok(Value::Array(bytes.into_iter().map(Value::from).collect()))
    }

    /// FileCache.get: the cached file, downloading it first if needed
    pub async fn get(&self, request: CacheRequest, api: ApiContext) -> Result<Value, String> {
        if !is_safe_segment(&request.name) {
            return Err(format!("Invalid cache name {}", request.name));
        }
        if let Some(entry) = self.entry(&request.key) {
            if self.folder.join(&entry.name).exists() {
                return self.read_result(&entry.name, request.response_type.as_deref());
            }
        }
        let size = self.download(&request, &api).await?;
        self.record(&request.key, &request.name, size);
        self.read_result(&request.name, request.response_type.as_deref())
    }

    async fn download(&self, request: &CacheRequest, api: &ApiContext) -> Result<u64, String> {
        use futures_util::StreamExt;
        std::fs::create_dir_all(&self.folder).map_err(|e| e.to_string())?;
        let url = api_url(&api.api_server, &request.url)?;
        let mut http = crate::http::client().get(&url).query(&query_pairs(&request.params));
        if let Some(token) = api.token.as_deref().filter(|t| !t.is_empty()) {
            http = http.header("Authorization", format!("bearer {token}"));
        }
        let response = http.send().await.map_err(|e| format!("GET {url} failed: {e}"))?;
        if !response.status().is_success() {
            return Err(format!("GET {url} failed: {}", response.status()));
        }
        let extract = request.extract.unwrap_or(false);
        let dest = self.folder.join(&request.name);
        let part = self.folder.join(format!("{}.part", request.name));
        let mut file = tokio::fs::File::create(&part).await.map_err(|e| e.to_string())?;
        let mut size: u64 = 0;
        let mut stream = response.bytes_stream();
        while let Some(chunk) = stream.next().await {
            let chunk = match chunk {
                Ok(chunk) => chunk,
                Err(error) => {
                    let _ = tokio::fs::remove_file(&part).await;
                    return Err(format!("GET {url} failed: {error}"));
                }
            };
            size += chunk.len() as u64;
            tokio::io::AsyncWriteExt::write_all(&mut file, &chunk).await.map_err(|e| e.to_string())?;
        }
        tokio::io::AsyncWriteExt::flush(&mut file).await.map_err(|e| e.to_string())?;
        drop(file);
        if extract {
            let result = extract_zip(&part, &dest).and_then(|_| rename_render_files(&dest).map_err(|e| e.to_string()));
            let _ = std::fs::remove_file(&part);
            result?;
        } else {
            std::fs::rename(&part, &dest).map_err(|e| e.to_string())?;
        }
        Ok(size)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cache_urls_encode_each_segment() {
        let url = cache_url("abc-def");
        if cfg!(windows) {
            assert_eq!(url, "http://stemn-file.localhost/cache/abc-def");
        } else {
            assert_eq!(url, "stemn-file://cache/abc-def");
            assert_eq!(cache_url("a b/c#d\\e"), "stemn-file://cache/a%20b/c%23d/e");
            assert_eq!(cache_url("it's(1)"), "stemn-file://cache/it's(1)");
        }
    }

    #[test]
    fn resolves_files_inside_the_cache() {
        let folder = Path::new("/profile/FileCache");
        assert_eq!(
            resolve_request_path(folder, "stemn-file://cache/abc-def"),
            Some(folder.join("abc-def"))
        );
        assert_eq!(
            resolve_request_path(folder, "stemn-file://cache/render/1/model.svf"),
            Some(folder.join("render").join("1").join("model.svf"))
        );
        assert_eq!(
            resolve_request_path(folder, "stemn-file://cache/a%20b"),
            Some(folder.join("a b"))
        );
        assert_eq!(
            resolve_request_path(folder, "http://stemn-file.localhost/cache/abc"),
            Some(folder.join("abc"))
        );
    }

    #[test]
    fn round_trips_cache_urls() {
        let folder = Path::new("/profile/FileCache");
        for name in ["5a1b-5c2d", "a b", "x#y", "ü.pdf"] {
            assert_eq!(resolve_request_path(folder, &cache_url(name)), Some(folder.join(name)), "{name}");
        }
    }

    #[test]
    fn rejects_traversal_and_other_hosts() {
        let folder = Path::new("/profile/FileCache");
        for uri in [
            "stemn-file://cache/",
            "stemn-file://cache",
            "stemn-file://cache/..%2Fstate.json",
            "stemn-file://cache/a%5C..%5C..%5Cx",
            "stemn-file://cache/C%3A%5Cwindows",
            "stemn-file://cache/a%00b",
            "stemn-file://other/abc",
            "stemn-file:///etc/passwd",
            "http://stemn-file.localhost/other/abc",
            "http://stemn-file.localhost/cache/",
            "http://evil.localhost/cache/abc",
            "https://example.com/cache/abc",
            "not a url",
        ] {
            assert_eq!(resolve_request_path(folder, uri), None, "{uri}");
        }
    }

    #[test]
    fn dot_segments_never_leave_the_folder() {
        // the url parser removes dot segments before we see them: whatever is left stays inside
        let folder = Path::new("/profile/FileCache");
        for uri in ["stemn-file://cache/../state.json", "stemn-file://cache/%2e%2e/state.json", "stemn-file://cache/a/../../b"] {
            if let Some(path) = resolve_request_path(folder, uri) {
                assert!(path.starts_with(folder), "{uri} -> {path:?}");
            }
        }
    }

    #[test]
    fn sniffs_content_types() {
        let p = Path::new("/c/abc");
        assert_eq!(content_type(p, b"%PDF-1.7\n"), "application/pdf");
        assert_eq!(content_type(p, b"\x89PNG\r\n\x1a\nxxxx"), "image/png");
        assert_eq!(content_type(p, &[0xff, 0xd8, 0xff, 0xe0]), "image/jpeg");
        assert_eq!(content_type(p, b"# Title"), "application/octet-stream");
        assert_eq!(content_type(Path::new("/c/r/1/model.png"), b""), "image/png");
        assert_eq!(content_type(Path::new("/c/r/1/model.svf"), b"PK"), "application/octet-stream");
    }

    #[test]
    fn api_urls() {
        assert_eq!(
            api_url("http://localhost:3000", "/api/v1/sync/download/p/f/").unwrap(),
            "http://localhost:3000/api/v1/sync/download/p/f/"
        );
        assert_eq!(api_url("https://stemn.com/", "api/v1/x").unwrap(), "https://stemn.com/api/v1/x");
        assert_eq!(api_url("https://stemn.com", "https://stemn.com/api/v1/x").unwrap(), "https://stemn.com/api/v1/x");
        assert!(api_url("https://stemn.com", "https://stemn.com.evil.io/x").is_err());
        assert!(api_url("https://stemn.com", "http://169.254.169.254/latest").is_err());
    }

    #[test]
    fn query_params_like_axios() {
        let params: Map<String, Value> =
            serde_json::from_str(r#"{"timestamp": 123, "a": "b", "skip": null, "flag": true}"#).unwrap();
        let mut pairs = query_pairs(&Some(params));
        pairs.sort();
        assert_eq!(
            pairs,
            vec![
                ("a".into(), "b".into()),
                ("flag".into(), "true".into()),
                ("timestamp".into(), "123".into())
            ]
        );
        assert!(query_pairs(&None).is_empty());
    }

    #[test]
    fn index_is_compatible_with_the_electron_app() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::create_dir_all(dir.path().join("storage")).unwrap();
        // written by electron-json-storage (FileCache.js): size is the content-length header string
        std::fs::write(
            dir.path().join("storage/fileCache.json"),
            r#"{"f-r":{"timestamp":"2026-10-01T10:00:00.000Z","name":"f-r","size":"42"}}"#,
        )
        .unwrap();
        let cache = FileCache::new(dir.path());
        assert!(cache.is_cached("f-r"));
        assert_eq!(cache.total_size(), 42);
        cache.record("g-s", "g-s", 8);
        assert_eq!(cache.total_size(), 50);
        let saved: HashMap<String, CacheEntry> =
            serde_json::from_str(&std::fs::read_to_string(dir.path().join("storage/fileCache.json")).unwrap()).unwrap();
        assert_eq!(saved.len(), 2);
        assert_eq!(saved["g-s"].size, Value::from(8));
    }

    #[test]
    fn read_results_by_response_type() {
        let dir = tempfile::tempdir().unwrap();
        let cache = FileCache::new(dir.path());
        std::fs::create_dir_all(cache.folder()).unwrap();
        std::fs::write(cache.folder().join("k"), "# hello").unwrap();
        assert_eq!(cache.read_result("k", Some("json")).unwrap(), Value::String("# hello".into()));
        assert_eq!(cache.read_result("k", Some("path")).unwrap(), Value::String(cache_url("k")));
        assert_eq!(cache.read_result("k", None).unwrap().as_array().unwrap().len(), 7);
    }

    #[test]
    fn remove_deletes_the_file_and_the_entry() {
        let dir = tempfile::tempdir().unwrap();
        let cache = FileCache::new(dir.path());
        std::fs::create_dir_all(cache.folder()).unwrap();
        std::fs::write(cache.folder().join("k"), "x").unwrap();
        cache.record("k", "k", 1);
        assert!(cache.remove("k"));
        assert!(!cache.folder().join("k").exists());
        assert!(!cache.is_cached("k"));
        assert!(!cache.remove("k"));
    }

    #[test]
    fn extracts_renders_and_renames_models() {
        let dir = tempfile::tempdir().unwrap();
        let zip_path = dir.path().join("render.zip");
        {
            let mut writer = zip::ZipWriter::new(std::fs::File::create(&zip_path).unwrap());
            let options = zip::write::SimpleFileOptions::default();
            writer.start_file("1/part.svf", options).unwrap();
            writer.write_all(b"svf").unwrap();
            writer.start_file("1/thumb.png", options).unwrap();
            writer.write_all(b"png").unwrap();
            writer.start_file("2/model.svf", options).unwrap();
            writer.write_all(b"svf2").unwrap();
            writer.start_file("../escape.txt", options).unwrap();
            writer.write_all(b"nope").unwrap();
            writer.finish().unwrap();
        }
        let dest = dir.path().join("FileCache/render");
        extract_zip(&zip_path, &dest).unwrap();
        rename_render_files(&dest).unwrap();
        assert!(dest.join("1/model.svf").exists());
        assert!(dest.join("1/model.png").exists());
        assert!(dest.join("2/model.svf").exists());
        assert!(!dir.path().join("FileCache/escape.txt").exists());
        assert!(!dir.path().join("escape.txt").exists());
    }

    #[test]
    fn rejects_unsafe_names() {
        for name in ["", ".", "..", "a/b", "a\\b", "C:x"] {
            assert!(!is_safe_segment(name), "{name}");
        }
        assert!(is_safe_segment("5a1b2c-5d3e4f"));
    }
}
