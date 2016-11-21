module.exports = {
  api : {
    port : 49554
  },
  websocket : {
    host : process.env.WEBSOCKET_SERVER || 'localhost',
    port : 8000
  }
}
