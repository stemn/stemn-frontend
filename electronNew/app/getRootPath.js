const path = require('path')

export default (staticPath, filePath) => {
  let result
  if (process.env.NODE_ENV === 'development') {
    if (filePath) {
      // filepath will be the path to the file without any protocol
      return `${path.join(__dirname, `../../app${staticPath}`)}`
    } else {
      return `http://localhost:3001${staticPath}`
    }
  } else {
    if (filePath) {
      // filepath will be the path to the file without any protocol
      return `${path.join(__dirname, `../renderer${staticPath}`)}`
    } else {
      return `file://${path.join(__dirname, `../renderer${staticPath}`)}`
    }
  }
  return result
}
