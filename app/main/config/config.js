module.exports = {
  api : {
    port : process.env.NODE_ENV === 'development'
      ? 49554
      : 49555
  },
  websocket : {
    host : process.env.WEBSOCKET_SERVER || 'localhost',
    port : 8000
  }
}
