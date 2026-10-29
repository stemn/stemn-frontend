//! Local OAuth callback server: a port of stemn-frontend-desktop/app/main/api (express +
//! express-rate-limit). The OAuth apps redirect the system browser to
//! `http://localhost:49554/api/auth/<provider>?code=..`; the code is handed to the core window,
//! which dispatches `sendAuthToken({ provider, code })` like the Electron main process does.
//! Listens on 127.0.0.1 only, 30 requests per minute.
use std::collections::VecDeque;
use std::time::{Duration, Instant};

pub const API_PORT: u16 = 49554;
pub const RATE_LIMIT: usize = 30;
pub const RATE_WINDOW: Duration = Duration::from_secs(60);
const PROVIDERS: [&str; 4] = ["google", "dropbox", "facebook", "linkedin"];

pub const PAGE_HTML: &str = r#"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authorisation Successful</title>
  </head>
  <body style="font-family: sans-serif; background: rgba(0, 0, 0, 0.03);">
    <div style="width: 400px;
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);
      box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
      padding: 15px;
      color: rgba(0, 0, 0, 0.8);
      background: white;
      line-height: 1.3em;
      font-size: 14px">
      <b style="margin-bottom: 10px; display: block;">Authorisation Successful</b>
      <div>You can close this window and return to Stemn Desktop.</div>
      <div style="text-align: right; margin-top: 25px">
        <a style="text-decoration: none;" href="stemn:open">Open Stemn</a>
      </div>
    </div>
  </body>
  <script>
    window.top.close();
  </script>
</html>"#;

/// At most `limit` requests in any `window` (one client: localhost). express-rate-limit uses a
/// fixed window; a sliding one is at least as strict.
pub struct RateLimiter {
    limit: usize,
    window: Duration,
    hits: VecDeque<Instant>,
}

impl RateLimiter {
    pub fn new(limit: usize, window: Duration) -> Self {
        RateLimiter { limit, window, hits: VecDeque::new() }
    }

    /// Ok(remaining) if the request may proceed, Err(seconds until the next slot) otherwise
    pub fn check(&mut self, now: Instant) -> Result<usize, u64> {
        while let Some(first) = self.hits.front() {
            if now.duration_since(*first) >= self.window {
                self.hits.pop_front();
            } else {
                break;
            }
        }
        if self.hits.len() >= self.limit {
            let oldest = *self.hits.front().unwrap();
            let wait = self.window.saturating_sub(now.duration_since(oldest));
            return Err(wait.as_secs().max(1));
        }
        self.hits.push_back(now);
        Ok(self.limit - self.hits.len())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
pub struct Callback {
    pub provider: String,
    pub code: Option<String>,
}

/// `/api/auth/<provider>?code=..` -> Callback (GET only, known providers only)
pub fn parse_callback(method: &str, raw_url: &str) -> Option<Callback> {
    if !method.eq_ignore_ascii_case("GET") {
        return None;
    }
    let url = url::Url::parse(&format!("http://127.0.0.1{raw_url}")).ok()?;
    let provider = url.path().strip_prefix("/api/auth/")?.trim_end_matches('/');
    if !PROVIDERS.contains(&provider) {
        return None;
    }
    let code = url.query_pairs().find(|(key, _)| key == "code").map(|(_, value)| value.into_owned());
    Some(Callback { provider: provider.to_string(), code })
}

/// Start the server on a background thread. `on_callback` runs for every accepted callback.
pub fn start(on_callback: impl Fn(Callback) + Send + 'static) {
    std::thread::Builder::new()
        .name("stemn-oauth-callback".into())
        .spawn(move || {
            let server = match tiny_http::Server::http(("127.0.0.1", API_PORT)) {
                Ok(server) => server,
                Err(error) => {
                    log::warn!("Local API server could not listen on {API_PORT}: {error}");
                    return;
                }
            };
            let mut limiter = RateLimiter::new(RATE_LIMIT, RATE_WINDOW);
            let header = |name: &str, value: &str| tiny_http::Header::from_bytes(name.as_bytes(), value.as_bytes()).unwrap();
            for request in server.incoming_requests() {
                let response = match limiter.check(Instant::now()) {
                    Err(retry_after) => tiny_http::Response::from_string("Too many requests, please try again later.")
                        .with_status_code(429)
                        .with_header(header("Retry-After", &retry_after.to_string()))
                        .with_header(header("RateLimit-Policy", &format!("{RATE_LIMIT};w=60"))),
                    Ok(remaining) => {
                        let policy = header("RateLimit-Policy", &format!("{RATE_LIMIT};w=60"));
                        let limit = header("RateLimit", &format!("limit={RATE_LIMIT}, remaining={remaining}"));
                        match parse_callback(request.method().as_str(), request.url()) {
                            Some(callback) => {
                                log::info!("OAuth callback for {}", callback.provider);
                                on_callback(callback);
                                tiny_http::Response::from_string(PAGE_HTML)
                                    .with_header(header("Content-Type", "text/html; charset=utf-8"))
                                    .with_header(policy)
                                    .with_header(limit)
                            }
                            None => tiny_http::Response::from_string("Not Found")
                                .with_status_code(404)
                                .with_header(policy)
                                .with_header(limit),
                        }
                    }
                };
                let _ = request.respond(response);
            }
        })
        .expect("OAuth callback thread");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_provider_callbacks() {
        assert_eq!(
            parse_callback("GET", "/api/auth/dropbox?code=abc%20123&state=x"),
            Some(Callback { provider: "dropbox".into(), code: Some("abc 123".into()) })
        );
        assert_eq!(
            parse_callback("get", "/api/auth/google"),
            Some(Callback { provider: "google".into(), code: None })
        );
        assert_eq!(parse_callback("POST", "/api/auth/google?code=1"), None);
        assert_eq!(parse_callback("GET", "/api/auth/github?code=1"), None);
        assert_eq!(parse_callback("GET", "/api/auth/../auth/google"), parse_callback("GET", "/api/auth/google"));
        assert_eq!(parse_callback("GET", "/"), None);
    }

    #[test]
    fn rate_limits_30_per_minute() {
        let start = Instant::now();
        let mut limiter = RateLimiter::new(RATE_LIMIT, RATE_WINDOW);
        for i in 0..RATE_LIMIT {
            assert_eq!(limiter.check(start + Duration::from_millis(i as u64)), Ok(RATE_LIMIT - i - 1));
        }
        let blocked = limiter.check(start + Duration::from_secs(10));
        assert_eq!(blocked, Err(50));
        // the window slides: a minute after the first hit there is room again
        assert!(limiter.check(start + Duration::from_secs(60)).is_ok());
        assert!(limiter.check(start + Duration::from_secs(60)).is_err());
    }

    #[test]
    fn serves_the_callback_page_and_404s() {
        // Real socket on an ephemeral port: same handler logic as `start`
        let server = tiny_http::Server::http("127.0.0.1:0").unwrap();
        let port = server.server_addr().to_ip().unwrap().port();
        let handle = std::thread::spawn(move || {
            for _ in 0..2 {
                let request = server.recv().unwrap();
                let response = match parse_callback(request.method().as_str(), request.url()) {
                    Some(_) => tiny_http::Response::from_string(PAGE_HTML),
                    None => tiny_http::Response::from_string("Not Found").with_status_code(404),
                };
                request.respond(response).unwrap();
            }
        });
        let get = |path: &str| {
            use std::io::{Read, Write};
            let mut stream = std::net::TcpStream::connect(("127.0.0.1", port)).unwrap();
            write!(stream, "GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n").unwrap();
            let mut body = String::new();
            stream.read_to_string(&mut body).unwrap();
            body
        };
        assert!(get("/api/auth/google?code=1").contains("Authorisation Successful"));
        assert!(get("/nope").starts_with("HTTP/1.1 404"));
        handle.join().unwrap();
    }
}
