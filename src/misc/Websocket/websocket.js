import ws from 'ws';
import primus from './primus-websockets.js';

export let socket = undefined;

export const initialise = (hostUrl) => {

  socket = primus.connect(hostUrl);

  const socketError = (err) => socket.write({
    type : 'log',
    payload : {
      type : 'error',
      message : err.message
    }
  });
  
  socket.on('error', socketError);

  // nonsense
  const oldWrite = socket.write.bind(socket);
  socket.write = (data) => {
//    console.log('WRITING DATA\n', JSON.stringify(data, null, 4));
    return oldWrite(data);
  }

//  socket.on('data', (data) => console.log('WEBSOCKET RECEIVED DATA:\n', JSON.stringify(data)));
  
  return socket;
}
