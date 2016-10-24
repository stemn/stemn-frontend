//import * as ws from 'ws';
import primus from '../../../primus-websockets.js';
//import { createSocket } from '../../../primus-uws.js';

//const Socket = createSocket({ transformer : 'websockets' });

const lib = {
  log : (data) => console.log(data)
};

export const initialise = (config) => {

  const socket = primus.connect(`${config.host}:${config.port}`);

  console.log('primus', socket);
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
