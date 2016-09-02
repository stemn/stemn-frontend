import { Primus } from 'primus';

const Socket = Primus.createSocket({ transformer : 'uws' });

const lib = {};

export const initialise = (config) => {
  lib.socket = new Socket(`${config.host}:${config.port}?authorization=${config.token}`);
  return lib.socket;
}

export const write = (data) => lib.socket.write(data);

lib.socket.on('data', (data) => {
  const target = lib[data.action] || socketError;
  return target(data.payload);
});

const socketError = (err) => write({
  action : 'log',
  payload : {
    type : 'error',
    message : err.message
  }
});

lib.socket.on('error', socketError);
