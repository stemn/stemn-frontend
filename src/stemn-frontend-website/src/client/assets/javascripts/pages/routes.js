module.exports = process.env.NODE_ENV === 'production'
  ? require('./routes.production')
  : require('./routes.development')
