module.exports = process.env.NODE_ENV === 'production'
  ? require('./configureStore.production').default
  : require('./configureStore.development').default
