export default () => {
  window.Raven && Raven.config('http://8c8770d2e0334ba1aafa51e90da63e65@sentry.stemn.com/7').install()
}