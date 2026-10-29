import { withRouteProps } from 'stemn-shared/routing'
import AppRootPage from './pages/AppRootPage/AppRootPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import ProjectPage from './pages/ProjectPage/ProjectPage.jsx'
import AppAuthedPage from './pages/AppAuthedPage/AppAuthedPage.jsx'
import AppUnAuthedPage from './pages/AppUnAuthedPage/AppUnAuthedPage.jsx'

const page = Component => ({ Component: withRouteProps(Component) })

/** Route config of the tray ("menubar") window, see ../main/routes.js */
export default () => [{
  path: '/',
  ...page(AppRootPage),
  children: [{
    ...page(AppAuthedPage),
    children: [
      { index: true, ...page(HomePage) },
      { path: '/project/:stub', ...page(ProjectPage) },
    ],
  }, {
    ...page(AppUnAuthedPage),
    children: [
      { path: '/login', ...page(LoginPage) },
    ],
  }],
}]
