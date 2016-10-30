import primus from '../../../primus-websockets.js';
import ws from 'ws';

export let socket = undefined;

export const initialise = (config) => {

  socket = primus.connect(`${config.host}:${config.port}`);

  const socketError = (err) => socket.write({
    type : 'log',
    payload : {
      type : 'error',
      message : err.message
    }
  });

  socket.on('error', socketError);

  socket.on('data', (data) => console.log('WEBSOCKET RECEIVED DATA:\n', JSON.stringify(data)));

  return socket;
}
