`primus-websockets2.js` is the Primus client library generated on the primus server by running `primus.library()`
(websockets transformer), converted to an ES module (`export default Primus`).
Whenever the primus settings change, this library must be regenerated and the module conversion re-applied.
Both browsers and the Electron main process (Node 22+) provide a global `WebSocket`, so the client needs no `ws` package.
