import { createSocket } from 'primus';
import 'ws';

const Socket = createSocket({ transformer : 'websockets' });

const lib = {
 log : (data) => console.log(data)
};

export const initialise = (config) => {

 const socket = new Socket(`${config.host}:${config.port}`);
console.log(socket)
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
