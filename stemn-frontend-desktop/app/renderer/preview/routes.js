import { withRouteProps } from 'stemn-shared/routing'
import AppRootPage from './pages/AppRootPage/AppRootPage.jsx'
import { PreviewPageContainer } from './pages/PreviewPage'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import AppAuthedPage from './pages/AppAuthedPage/AppAuthedPage.jsx'
import AppUnAuthedPage from './pages/AppUnAuthedPage/AppUnAuthedPage.jsx'

const page = Component => ({ Component: withRouteProps(Component) })

/** Route config of the file preview windows (`#/?projectId=..&fileId=..&revisionId=..` or `#/?localPath=..`) */
export default () => [{
  ...page(AppRootPage),
  children: [{
    ...page(AppAuthedPage),
    children: [
      { path: '/', ...page(PreviewPageContainer) },
    ],
  }, {
    ...page(AppUnAuthedPage),
    children: [
      { path: '/login', ...page(LoginPage) },
    ],
  }],
}]
