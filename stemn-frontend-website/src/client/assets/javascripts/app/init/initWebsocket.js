import { initialise as initWebsocket } from 'stemn-shared/misc/Websocket/websocket'
import socketEventMap from 'stemn-shared/misc/Websocket/eventMap'

export default (store) => {
  const socket = initWebsocket(GLOBAL_ENV.WEBSOCKET_SERVER)
  socket.on('data', (action) => {
    socketEventMap(store, action)
  })
}
