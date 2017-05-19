import board from './board'
import files from './files'
import project from './project'
import render from './render'

export default (store, action) => {
  board(store, action)
  files(store, action)
  project(store, action)
  render(store, action)
}
