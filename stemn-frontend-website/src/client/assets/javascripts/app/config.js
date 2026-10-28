/* eslint no-console:0 */
export function logException(ex, context) {
  if (window.Sentry) {
    window.Sentry.captureException(ex, { extra: context })
  }
  console.error(ex, context)
}
