/**
 * Sentry is optional: it is only loaded (as a separate chunk) when the
 * SENTRY_DSN environment variable was set at build time.
 */
export default () => {
  if (!GLOBAL_ENV.SENTRY_DSN) return
  import('@sentry/browser')
    .then((Sentry) => {
      Sentry.init({ dsn: GLOBAL_ENV.SENTRY_DSN, environment: GLOBAL_ENV.NODE_ENV })
      window.Sentry = Sentry
    })
    .catch(err => console.error('Failed to load Sentry', err))
}
