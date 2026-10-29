import express from 'express'
import { rateLimit } from 'express-rate-limit'
import log from 'electron-log/main'
import { authGoogle, authDropbox, authFacebook, authLinkedin } from './routes.js'

/** Port of the local OAuth callback server. The OAuth apps redirect to http://localhost:49554/api/auth/<provider> */
export const API_PORT = 49554

export default (store) => {
  const server = express()

  // The callbacks are hit once per sign-in; anything more is not a browser redirect
  server.use(rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }))

  // attach the store to all requests
  server.use((req, res, next) => {
    req.store = store
    next()
  })

  server.get('/api/auth/google', authGoogle)
  server.get('/api/auth/dropbox', authDropbox)
  server.get('/api/auth/facebook', authFacebook)
  server.get('/api/auth/linkedin', authLinkedin)

  // Only reachable from this machine
  const listener = server.listen(API_PORT, '127.0.0.1')
  listener.on('error', (error) => log.warn(`Local API server could not listen on ${API_PORT}:`, error.message))

  return server
}
