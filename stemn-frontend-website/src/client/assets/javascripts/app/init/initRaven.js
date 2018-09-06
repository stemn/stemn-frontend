export default () => {
  window.Raven && window.Raven.config('https://8c8770d2e0334ba1aafa51e90da63e65@sentry.stemn.com/7').install()
}