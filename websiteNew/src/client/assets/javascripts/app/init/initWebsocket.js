import { initialise as initWebsocket } from 'stemn-shared/misc/Websocket/websocket.js'

export default (store) => {
  const socket = initWebsocket(GLOBAL_ENV.WEBSOCKET_SERVER)
}