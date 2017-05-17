import primus from './primusSockjs.js'
export let socket = undefined

export const initialise = (hostUrl) => {
  socket = primus.connect(hostUrl);
  socket.on('error', console.error )
  
  // Log stuff
  if (GLOBAL_ENV.NODE_ENV === 'development') {
    // Receive
    const socketData = (data) => {
      console.groupCollapsed(` socket | RECEIVE      ${data.type}`);
      console.log(data)
      console.groupEnd();
    }
    socket.on('data', socketData)

    // Write
    const oldWrite = socket.write.bind(socket);
    socket.write = (data) => {
      console.groupCollapsed(` socket | SEND         ${data.type}`);
      console.log(data)
      console.groupEnd();
      return oldWrite(data)
    }
  }

  socket.write({
    type: 'ADMIN/ECHO',
    payload: {
      test: 'gooba'
    }
  })
  return socket
}
