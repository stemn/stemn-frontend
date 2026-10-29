// The vendored primus client (stemn-shared/misc/Websocket/primus-websockets*.js)
// falls back to require('ws') when there is no global WebSocket. Electron's
// main process (Node 22+) has a WHATWG WebSocket global, so use that instead
// of bundling the `ws` package.
module.exports = globalThis.WebSocket
