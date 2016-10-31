import primus from '../../../primus-websockets.js';
import ws from 'ws';

export let socket = undefined;

export const initialise = (config) => {

  socket = primus.connect(`${config.host}:${config.port}`);

  const oldWrite = socket.write.bind(socket);
  socket.write = (data) => {
      console.log('WRITING DATA\n', JSON.stringify(data, null, 4));
      return oldWrite(data);
  }

  socket.on('error', (err) => socket.write({
    type : 'ADMIN/LOG',
    payload : {
      type : 'error',
      message : err.message
    }
}));

  socket.on('data', (data) => console.log('WEBSOCKET RECEIVED DATA:\n', JSON.stringify(data)));

  return socket;
}
