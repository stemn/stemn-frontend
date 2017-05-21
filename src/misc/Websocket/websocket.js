import ws from 'ws'
import primus from './primus-websockets2.js'
import qs from 'querystring'

const searchParams = typeof window !== 'undefined'
  ? qs.parse(window.location.search.substring(1))
  : {}

export let socket = undefined;

export const initialise = (hostUrl) => {

  socket = primus.connect(hostUrl);

  // Log stuff
  if (GLOBAL_ENV.NODE_ENV === 'development' || searchParams.debug) {
    // Receive
    const socketData = (data) => {
      if (GLOBAL_ENV.APP_THREAD === 'electron') {
        console.log(`socket | RECEIVE - ${data.type}`)
      } else {
        console.groupCollapsed(` socket | RECEIVE      ${data.type}`);
        console.log(data)
        console.groupEnd();
      }
    }
    socket.on('data', socketData)

    // Write
    const oldWrite = socket.write.bind(socket);
    socket.write = (data) => {
      if (GLOBAL_ENV.APP_THREAD === 'electron') {
        console.log(`socket | SEND - ${data.type}`)
      } else {
        console.groupCollapsed(` socket | SEND         ${data.type}`);
        console.log(data)
        console.groupEnd();
      }
      return oldWrite(data)
    }
  }

  socket.write({
    type: 'ADMIN/ECHO',
    payload: {
      test: 'test'
    }
  })

  return socket;
}
