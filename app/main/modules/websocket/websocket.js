import Primus from 'primus';

const Socket = Primus.createSocket({ transformer : 'websockets' });

const lib = {};

export const initialise = (config) => {
  const socket = new Socket(`${config.host}:${config.port}?authorization=${config.token}`);

  socket.on('data', (data) => {
    const target = lib[data.action] || socketError;
    return target(data.payload);
  });

  const socketError = (err) => socket.write({
    action : 'log',
    payload : {
      type : 'error',
      message : err.message
    }
  });

  socket.on('error', socketError);

  return socket;
}
