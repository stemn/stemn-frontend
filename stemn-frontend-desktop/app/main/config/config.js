module.exports = {
  api: {
    port: 49554,
  },
  websocket: {
    host: GLOBAL_ENV.WEBSOCKET_SERVER || 'localhost',
    port: 8000,
  },
}
