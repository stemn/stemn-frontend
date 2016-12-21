import app             from './views/app/app.js';
import applications    from './views/applications/applications.js';
import auth            from './views/auth/auth.js';
import browse          from './views/browse/browse.js';
import careers         from './views/careers/careers.js';
import compare         from './views/compare/compare.js';
import contact         from './views/contact/contact.js';
import create          from './views/create/create.js';
import creations       from './views/creations/creations.js';
import dashboard       from './views/dashboard/dashboard.js';
import error           from './views/error/error.js';
import faq             from './views/faq/faq.js';
import field           from './views/field/field.js';
import following       from './views/following/following.js';
import home            from './views/home/home.js';
import index           from './views/index/index.js';
import job             from './views/job/job.js';
import landing         from './views/landing/landing.js';
import login           from './views/login/login.js';
import map             from './views/map/map.js';
import notifications   from './views/notifications/notifications.js';
import onboarding      from './views/onboarding/onboarding.js';
import open            from './views/open/open.js';
import organisation    from './views/organisation/organisation.js';
import partners        from './views/partners/partners.js';
import passwordReset   from './views/password-reset/password-reset.js';
import preview         from './views/preview/preview.js';
import privacy         from './views/privacy/privacy.js';
import project         from './views/project/project.js';
import referrals       from './views/referrals/referrals.js';
import scholarship     from './views/scholarship/scholarship.js';
import search          from './views/search/search.js';
import security        from './views/security/security.js';
import siteSearch      from './views/site-search/site-search.js';
import terms           from './views/terms/terms.js';
import test            from './views/test/test.js';
import thread          from './views/thread/thread.js';
import track           from './views/track/track.js';
import user            from './views/user/user.js';
import userOnboarding  from './views/user-onboarding/user-onboarding.js';
import usersettings    from './views/usersettings/usersettings.js';

const moduleName = 'routes';

angular.module(moduleName, [
  'views.app',
  'views.careers',
  'views.contact',
  'views.create',
  'views.creations',
  'views.error',
  'views.faq',
  'views.field',
  'views.home',
  'views.landing',
  'views.login',
  'views.organisation',
  'views.partners',
  'views.privacy',
  'views.project',
  'views.scholarship',
  'views.search',
  'views.security',
  'views.terms',
  'views.test',
  'views.thread',
  'views.user',
  'views.user-onboarding',
  'views.usersettings',
  'views.following',
  'views.browse',
  'views.password-reset',
  'views.map',
  'views.job',
  'views.index',
  'views.applications',
  'views.referrals',
  'views.notifications',
  'views.track',
  'views.open',
  'views.onboarding',
  'views.preview',
  'views.auth',
  'views.dashboard',
  'views.compare',
])

export default moduleName