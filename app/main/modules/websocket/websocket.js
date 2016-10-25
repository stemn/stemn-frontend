import primus from '../../../primus-websockets.js';
import ws from 'ws';

console.log('ws', !!ws);
console.log('primus', !!primus);


export const initialise = (config) => {

  const socket = primus.connect(`${config.host}:${config.port}`);

//  console.log('primus', socket);
//  const socket = new Socket(`${config.host}:${config.port}`);

  const socketError = (err) => socket.write({
    type : 'log',
    payload : {
      type : 'error',
      message : err.message
    }
  });

  socket.on('error', socketError);

  return socket;
}
