const path = require('path')

export default (staticPath, filePath) => {
  let result
  if (process.env.NODE_ENV === 'development') {
    if (filePath) {
      // filepath will be the path to the file without any protocol
      return `${path.join(__dirname, `../../app/static${staticPath}`)}`
    } else {
      return `http://localhost:3001/static${staticPath}`
    }
  } else {
    return `file://${path.join(__dirname, `./static${staticPath}`)}`
  }
  return result
}
