//! `stemn-file://cache/<path>` (Windows: `http://stemn-file.localhost/cache/<path>`): serves files
//! from `<profile>/FileCache` to the windows, e.g. downloaded PDFs for pdf.js and renders.
//! Only files inside the cache folder are served (see cache::resolve_request_path).
use crate::cache::{content_type, resolve_request_path};
use crate::state::AppState;
use tauri::http::{Request, Response, StatusCode};
use tauri::{Manager, UriSchemeContext, UriSchemeResponder, Wry};

fn not_found() -> Response<Vec<u8>> {
    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("Access-Control-Allow-Origin", "*")
        .body(b"Not found".to_vec())
        .unwrap()
}

pub fn respond(folder: &std::path::Path, uri: &str) -> Response<Vec<u8>> {
    let Some(path) = resolve_request_path(folder, uri) else {
        return not_found();
    };
    match std::fs::read(&path) {
        Ok(bytes) => Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", content_type(&path, &bytes[..bytes.len().min(16)]))
            .header("Access-Control-Allow-Origin", "*")
            .header("Cache-Control", "no-cache")
            .body(bytes)
            .unwrap(),
        Err(_) => not_found(),
    }
}

pub fn handle(ctx: UriSchemeContext<'_, Wry>, request: Request<Vec<u8>>, responder: UriSchemeResponder) {
    let app = ctx.app_handle().clone();
    let uri = request.uri().to_string();
    // file reads off the main thread
    tauri::async_runtime::spawn_blocking(move || {
        let folder = app.state::<AppState>().cache.folder().to_path_buf();
        responder.respond(respond(&folder, &uri));
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn serves_cached_files_only() {
        let dir = tempfile::tempdir().unwrap();
        let folder = dir.path().join("FileCache");
        std::fs::create_dir_all(&folder).unwrap();
        std::fs::write(folder.join("f-r"), b"%PDF-1.4 test").unwrap();
        std::fs::write(dir.path().join("secret.json"), b"{}").unwrap();

        let ok = respond(&folder, &crate::cache::cache_url("f-r"));
        assert_eq!(ok.status(), StatusCode::OK);
        assert_eq!(ok.headers()["Content-Type"], "application/pdf");
        assert_eq!(ok.headers()["Access-Control-Allow-Origin"], "*");
        assert_eq!(ok.body(), b"%PDF-1.4 test");

        assert_eq!(respond(&folder, "stemn-file://cache/missing").status(), StatusCode::NOT_FOUND);
        assert_eq!(respond(&folder, "stemn-file://cache/..%2Fsecret.json").status(), StatusCode::NOT_FOUND);
        assert_eq!(respond(&folder, "stemn-file://cache/%2E%2E/secret.json").status(), StatusCode::NOT_FOUND);
        assert_eq!(respond(&folder, "stemn-file://other/f-r").status(), StatusCode::NOT_FOUND);
    }
}
