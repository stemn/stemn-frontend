// Route loading utils
const errorLoading = (err)  =>{
  console.error('Dynamic page loading failed', err)
}
const loadRoute = (cb) => (module) => cb(null, module.default)

export const getRoute = (systemImport, cb) => systemImport.then(loadRoute(cb)).catch(errorLoading)
