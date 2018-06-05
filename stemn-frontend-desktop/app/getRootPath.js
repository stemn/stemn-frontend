const path = require('path')

export default (staticPath, filePath) => {
  // DEVELOPMENT
  // If we are in dev, we use the local dev server
  if (process.env.NODE_ENV === 'development') {
    if (filePath) {
      // filepath will be the path to the file without any protocol
      return `${path.join(__dirname, `../../app${staticPath}`)}`
    } 
    return `http://localhost:3001${staticPath}`
  }

  // PRODUCTION
  // If we are in electron, root is relative to the current directory
  if (GLOBAL_ENV.APP_THREAD === 'electron') {
    if (filePath) {
      // filepath will be the path to the file without any protocol
      return `${path.join(__dirname, `../renderer${staticPath}`)}`
    } 
    return `file://${path.join(__dirname, `../renderer${staticPath}`)}`
  }
  // If we are in a renderer, root is relative to the html file
  if (GLOBAL_ENV.APP_THREAD === 'renderer') {
    return `../..${staticPath}`
  }
}
