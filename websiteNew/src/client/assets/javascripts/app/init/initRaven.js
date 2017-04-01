import { SENTRY_URL } from '../config';

export default () => {
  window.Raven && Raven.config(SENTRY_URL).install();
}