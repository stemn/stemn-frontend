import express from 'express';
import config from '../config/config.js'
import { authGoogle } from './routes.js'

export default (store) => {

  const server = express();

  // attach the store to all requests
  server.use((req, res, next) => {
    req.store = store;
    next();
  });

  server.get('/api/auth/google', authGoogle);

  server.listen(config.api.port);

  return server;
}
