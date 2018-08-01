module.exports = process.env.NODE_ENV === 'production'
  ? require('./routes.development')
  : require('./routes.development')
