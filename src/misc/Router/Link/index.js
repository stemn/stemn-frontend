if (GLOBAL_ENV.APP_TYPE === 'web') {
  module.exports = require('./Link.container.web')
}
else {
  module.exports = require('./Link.container.development')
}
