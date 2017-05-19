import ws from 'ws';
import primus from './primus-websockets2.js';

export let socket = undefined;

export const initialise = (hostUrl) => {

  socket = primus.connect(hostUrl);

  // Log stuff
  if (GLOBAL_ENV.NODE_ENV === 'development') {
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
      test: 'gooba'
    }
  })

  return socket;
}


//import SockJs from 'sockjs-client'
//export let socket = undefined
//
//export const initialise = (hostUrl) => {
//  socket = new SockJs(hostUrl);
////  socket.on('error', console.error )
//
////  // Log stuff
////  if (GLOBAL_ENV.NODE_ENV === 'development') {
////    // Receive
////    const socketData = (data) => {
////      if (GLOBAL_ENV.APP_THREAD === 'electron') {
////        console.log(`socket | RECEIVE - ${data.type}`)
////      } else {
////        console.groupCollapsed(` socket | RECEIVE      ${data.type}`);
////        console.log(data)
////        console.groupEnd();
////      }
////    }
////    socket.on('data', socketData)
////
////    // Write
////    const oldWrite = socket.write.bind(socket);
////    socket.write = (data) => {
////      if (GLOBAL_ENV.APP_THREAD === 'electron') {
////        console.log(`socket | SEND - ${data.type}`)
////      } else {
////        console.groupCollapsed(` socket | SEND         ${data.type}`);
////        console.log(data)
////        console.groupEnd();
////      }
////      return oldWrite(data)
////    }
////  }
////
////  socket.write({
////    type: 'ADMIN/ECHO',
////    payload: {
////      test: 'gooba'
////    }
////  })
//
//   socket.onopen = () => {
//     console.log('-----------------------------------------------');
//     console.log('open');
//     socket.send('test');
//   }
//
//
//   socket.onmessage = (e) => {
//     console.log('message', e.data);
//   }
//
//   socket.onclose = () => {
//     console.log('-----------------------------------------------');
//     console.log('close');
//   };
//
//  return socket
//}
