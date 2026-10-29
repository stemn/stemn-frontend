/** ***************************************************************

Route config of the main window (react-router data router, hash history).

Every page component is wrapped with `withRouteProps` so it keeps
receiving the react-router v3 props it was written for:
`params`, `location` (with `.query`) and `children` (the child route).

**************************************************************** */
import { withRouteProps } from 'stemn-shared/routing'

import AppRootPage from './pages/AppRootPage/AppRootPage'
import AppAuthedPage from './pages/AppAuthedPage/AppAuthedPage'
import AppUnAuthedPage from './pages/AppUnAuthedPage/AppUnAuthedPage'
import AppEitherPage from './pages/AppEitherPage/AppEitherPage'
import ProjectChangesPage from './pages/ProjectChangesPage/ProjectChangesPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx'
import SettingsAccountPage from './pages/SettingsPage/SettingsAccountPage/SettingsAccountPage.jsx'
import SettingsApplicationPage from './pages/SettingsPage/SettingsApplicationPage/SettingsApplicationPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx'
import ProjectPage from './pages/ProjectPage/ProjectPage.container.js'
import ProjectFilesPage from './pages/ProjectPage/ProjectFilesPage'
import ProjectSettingsPage from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.jsx'
import ProjectSettingsGeneralPage from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsGeneralPage'
import ProjectSettingsThreadsPage from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsThreadsPage'
import ProjectSettingsTeamPage from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsTeamPage'
import ProjectSettingsPermissionsPage from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPermissionsPage'
import ProjectFeedPage from './pages/ProjectFeedPage/ProjectFeedPage.jsx'
import ProjectFeedCommitPage from './pages/ProjectFeedCommitPage'
import ProjectThreadPage from './pages/ProjectThreadPage/ProjectThreadPage.jsx'

const page = (Component) => ({ Component: withRouteProps(Component) })

export default () => [
  {
    ...page(AppRootPage),
    children: [
      {
        ...page(AppAuthedPage),
        children: [
          {
            path: '/project/:stub',
            ...page(ProjectPage),
            children: [
              { index: true, ...page(ProjectChangesPage) },
              {
                path: 'feed',
                ...page(ProjectFeedPage),
                children: [{ path: 'commit/:commitId', ...page(ProjectFeedCommitPage) }],
              },
              { path: 'threads', ...page(ProjectThreadPage) },
              { path: 'files', ...page(ProjectFilesPage) },
              { path: 'files/:path', ...page(ProjectFilesPage) },
              {
                path: 'settings',
                ...page(ProjectSettingsPage),
                children: [
                  { index: true, ...page(ProjectSettingsGeneralPage) },
                  { path: 'threads', ...page(ProjectSettingsThreadsPage) },
                  { path: 'team', ...page(ProjectSettingsTeamPage) },
                  { path: 'permissions', ...page(ProjectSettingsPermissionsPage) },
                ],
              },
            ],
          },
          { path: '/', ...page(HomePage) },
          { path: '/dashboard', ...page(DashboardPage) },
          {
            path: '/settings',
            ...page(SettingsPage),
            children: [{ path: 'account', ...page(SettingsAccountPage) }],
          },
        ],
      },
      {
        ...page(AppUnAuthedPage),
        children: [
          { path: '/login', ...page(LoginPage) },
          { path: '/register', ...page(RegisterPage) },
        ],
      },
      {
        ...page(AppEitherPage),
        children: [
          {
            path: '/settings',
            ...page(SettingsPage),
            children: [{ path: 'application', ...page(SettingsApplicationPage) }],
          },
        ],
      },
    ],
  },
]
