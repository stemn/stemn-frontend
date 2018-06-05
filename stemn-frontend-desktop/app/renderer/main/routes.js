
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AppRootPage from './pages/AppRootPage/AppRootPage'
import AppAuthedPage from './pages/AppAuthedPage/AppAuthedPage'
import AppUnAuthedPage from './pages/AppUnAuthedPage/AppUnAuthedPage'
import AppEitherPage from './pages/AppEitherPage/AppEitherPage'
import ProjectChangesPage from './pages/ProjectChangesPage/ProjectChangesPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
// import ErrorPage from './containers/ErrorPage/ErrorPage.container.js'
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

export default store => (
  <Route                                           component={ AppRootPage }>
    <Route                                         component={ AppAuthedPage }>
      <Route   path="/project/:stub"               component={ ProjectPage }>
        <IndexRoute                                component={ ProjectChangesPage } />
        <Route path="feed"                         component={ ProjectFeedPage }>
          <Route path="commit/:commitId"           component={ ProjectFeedCommitPage } />
        </Route>
        <Route path="threads"                      component={ ProjectThreadPage } />
        <Route path="files"                        component={ ProjectFilesPage } />
        <Route path="files/"                       component={ ProjectFilesPage } />
        <Route path="files/:path"                  component={ ProjectFilesPage } />
        <Route path="settings"                     component={ ProjectSettingsPage }>
          <IndexRoute                              component={ ProjectSettingsGeneralPage } />
          <Route path="threads"                    component={ ProjectSettingsThreadsPage } />
          <Route path="team"                       component={ ProjectSettingsTeamPage } />
          <Route path="permissions"                component={ ProjectSettingsPermissionsPage } />
        </Route>
      </Route>
      <Route   path="/"                            component={ HomePage } />
      <Route   path="/dashboard"                   component={ DashboardPage } />
      <Route   path="/settings"                    component={ SettingsPage }>
        <Route path="/settings/account"            component={ SettingsAccountPage } />
      </Route>
    </Route>
    <Route                                         component={ AppUnAuthedPage }>
      <Route path="/login"                         component={ LoginPage } />
      <Route path="/register"                      component={ RegisterPage } />
    </Route>
    <Route                                         component={ AppEitherPage }>
      <Route   path="/settings"                    component={ SettingsPage }>
        <Route path="/settings/application"        component={ SettingsApplicationPage } />
      </Route>
    </Route>
  </Route>
)
