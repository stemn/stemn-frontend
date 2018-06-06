import { loading, complete } from 'stemn-shared/misc/CodeSplitting/CodeSplitting.actions'

export const getRoute = (dispatch, systemImport, cb) => {
  // We dispatch the CodeSplitting loading/complete actions so we know the loading state
  // The loading action is wrapped in a timeout so it does not run if we already have
  // the route cached by the webpack magicical System.import
  const loadingTimeout = setTimeout(() => dispatch(loading('route')), 1000)
  return systemImport
    .then((module) => {
      clearTimeout(loadingTimeout)
      dispatch(complete('route'))
      cb(null, module.default)
    })
    .catch((err)  => {
      console.error('Dynamic page loading failed', err)
    })
}
