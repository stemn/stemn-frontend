if (process.env.NODE_ENV === 'production') {
  module.exports = require('./routes.production')
}
else {
  module.exports = require('./routes.development')
}
