import board from './board'
import files from './files'
import project from './project'
import render from './render'
import thread from './thread'
import type { SocketEventHandler } from './types'

const eventMap: SocketEventHandler = (store, action) => {
  board(store, action)
  files(store, action)
  project(store, action)
  render(store, action)
  thread(store, action)
}

export default eventMap
