/** ***************************************************************

IMPORTANT!
Any changes made here must be made in routes.production
These files should be almost identical. They should only differ by
which routes are async.

**************************************************************** */

import React                                  from 'react'
import { Route, IndexRoute, Redirect }        from 'react-router'
import { getRoute }                           from './routes.utils.js'

// Routes which are always sync
import AppAuthed                              from 'pages/AppAuthed'
import AppRoot                                from 'pages/AppRoot'
import AppUnAuthed                            from 'pages/AppUnAuthed'
import NotFoundView                           from 'pages/NotFound'
import Landing                                from 'pages/Landing'

export default ({ dispatch }) => {
  // Routes which are aync in prod
  const getDownload                              = (loc, cb) => getRoute(dispatch, System.import('pages/Download'), cb)
  const getExplore                               = (loc, cb) => getRoute(dispatch, System.import('pages/Explore'), cb)
  const getField                                 = (loc, cb) => getRoute(dispatch, System.import('pages/Field'), cb)
  const getFieldOverview                         = (loc, cb) => getRoute(dispatch, System.import('pages/FieldOverview'), cb)
  const getFile                                  = (loc, cb) => getRoute(dispatch, System.import('pages/File'), cb)
  const getFlow                                  = (loc, cb) => getRoute(dispatch, System.import('pages/Flow'), cb)
  const getHome                                  = (loc, cb) => getRoute(dispatch, System.import('pages/Home'), cb)
  const getLogin                                 = (loc, cb) => getRoute(dispatch, System.import('pages/Login'), cb)
  const getNotifications                         = (loc, cb) => getRoute(dispatch, System.import('pages/Notifications'), cb)
  const getNotificationsAll                      = (loc, cb) => getRoute(dispatch, System.import('pages/NotificationsAll'), cb)
  const getNotificationsUnread                   = (loc, cb) => getRoute(dispatch, System.import('pages/NotificationsUnread'), cb)
  const getOnboarding                            = (loc, cb) => getRoute(dispatch, System.import('pages/Onboarding'), cb)
  const getOnboardingAbout                       = (loc, cb) => getRoute(dispatch, System.import('pages/OnboardingAbout'), cb)
  const getOnboardingDownload                    = (loc, cb) => getRoute(dispatch, System.import('pages/OnboardingDownload'), cb)
  const getOnboardingSync                        = (loc, cb) => getRoute(dispatch, System.import('pages/OnboardingSync'), cb)
  const getOpenSource                            = (loc, cb) => getRoute(dispatch, System.import('pages/OpenSource'), cb)
  const getPricing                               = (loc, cb) => getRoute(dispatch, System.import('pages/Pricing'), cb)
  const getPrivacy                               = (loc, cb) => getRoute(dispatch, System.import('pages/Privacy'), cb)
  const getProject                               = (loc, cb) => getRoute(dispatch, System.import('pages/Project'), cb)
  const getProjectCommit                         = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectCommit'), cb)
  const getProjectCommits                        = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectCommits'), cb)
  const getProjectOverview                       = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectOverview'), cb)
  const getProjectPipeline                       = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectPipeline'), cb)
  const getProjectPipelineStep                   = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectPipelineStep'), cb)
  const getProjectPipelines                      = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectPipelines'), cb)
  const getProjectSettings                       = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettings'), cb)
  const getProjectSettingsGeneral                = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettingsGeneral'), cb)
  const getProjectSettingsPermissions            = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettingsPermissions'), cb)
  const getProjectSettingsTags                   = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettingsTags'), cb)
  const getProjectSettingsThreads                = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettingsThreads'), cb)
  const getProjectSettingsTeam                   = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectSettingsTeam'), cb)
  const getProjectThread                         = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectThread'), cb)
  const getProjectThreads                        = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectThreads'), cb)
  const getProjectTeam                           = (loc, cb) => getRoute(dispatch, System.import('pages/ProjectTeam'), cb)
  const getThread                                = (loc, cb) => getRoute(dispatch, System.import('pages/Thread'), cb)
  const getRegister                              = (loc, cb) => getRoute(dispatch, System.import('pages/Register'), cb)
  const getSearch                                = (loc, cb) => getRoute(dispatch, System.import('pages/Search'), cb)
  const getSecurity                              = (loc, cb) => getRoute(dispatch, System.import('pages/Security'), cb)
  const getSettings                              = (loc, cb) => getRoute(dispatch, System.import('pages/Settings'), cb)
  const getSettingsAccount                       = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsAccount'), cb)
  const getSettingsBilling                       = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsBilling'), cb)
  const getSettingsEmails                        = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsEmails'), cb)
  const getSettingsProfile                       = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsProfile'), cb)
  const getSettingsProfileDetails                = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsProfileDetails'), cb)
  const getSettingsProjects                      = (loc, cb) => getRoute(dispatch, System.import('pages/SettingsProjects'), cb)
  const getTerms                                 = (loc, cb) => getRoute(dispatch, System.import('pages/Terms'), cb)
  const getUser                                  = (loc, cb) => getRoute(dispatch, System.import('pages/User'), cb)
  const getUserDetails                           = (loc, cb) => getRoute(dispatch, System.import('pages/UserDetails'), cb)
  const getUserFollowers                         = (loc, cb) => getRoute(dispatch, System.import('pages/UserFollowers'), cb)
  const getUserFollowing                         = (loc, cb) => getRoute(dispatch, System.import('pages/UserFollowing'), cb)
  const getUserOverview                          = (loc, cb) => getRoute(dispatch, System.import('pages/UserOverview'), cb)
  const getUserProjects                          = (loc, cb) => getRoute(dispatch, System.import('pages/UserProjects'), cb)
  const getUserStars                             = (loc, cb) => getRoute(dispatch, System.import('pages/UserStars'), cb)

  const getPasswordLost                          = (loc, cb) => getRoute(dispatch, System.import('stemn-shared/pages/PasswordLost'), cb)
  const getPasswordSet                           = (loc, cb) => getRoute(dispatch, System.import('stemn-shared/pages/PasswordSet'), cb)
  
  return (
    <Route                                       component={ AppRoot }>
      <Route                                     component={ AppAuthed }>
        <Route path="onboarding"                 getComponent={ getOnboarding }>
          <IndexRoute                            getComponent={ getOnboardingAbout } />
          <Route path="sync"                     getComponent={ getOnboardingSync } />
          <Route path="download"                 getComponent={ getOnboardingDownload } />
        </Route>
        <Route path="settings"                   getComponent={ getSettings }>
          <IndexRoute                            getComponent={ getSettingsProfile } />
          <Route path="details"                  getComponent={ getSettingsProfileDetails } />
          <Route path="account"                  getComponent={ getSettingsAccount } />
          <Route path="billing"                  getComponent={ getSettingsBilling } />
          <Route path="emails"                   getComponent={ getSettingsEmails } />
          <Route path="projects"                 getComponent={ getSettingsProjects } />
        </Route>
        <Route path="notifications"              getComponent={ getNotifications }>
          <IndexRoute                            getComponent={ getNotificationsUnread } />
          <Route path="unread"                   getComponent={ getNotificationsUnread } />
          <Route path="all"                      getComponent={ getNotificationsAll } />
        </Route>
      </Route>
      <Route                                     component={ AppUnAuthed }>
        <Route path="login"                      getComponent={ getLogin } />
        <Route path="register"                   getComponent={ getRegister } />
      </Route>
      <Route path="/"                            getComponent={ getHome } />
      <Route path="password-lost"                getComponent={ getPasswordLost } />
      <Route path="/password-reset"              getComponent={ getPasswordSet } />
      <Route path="/fields/:fieldId"             getComponent={ getField }>
        <IndexRoute                              getComponent={ getFieldOverview } />
      </Route>
      <Route path="/download"                    getComponent={ getDownload } />
      <Route path="/explore"                     getComponent={ getExplore } />
      <Route path="/flow"                        getComponent={ getFlow } />
      <Route path="/files/:projectId/:fileId"    getComponent={ getFile } />
      <Route path="/landing"                     component={ Landing } />
      <Route path="/open-source"                 getComponent={ getOpenSource } />
      <Route path="/pricing"                     getComponent={ getPricing } />
      <Route path="/privacy"                     getComponent={ getPrivacy } />
      <Route path="/search"                      getComponent={ getSearch } />
      <Route path="/security"                    getComponent={ getSecurity } />
      <Route path="/terms"                       getComponent={ getTerms } />
      <Route path="thread/:threadId"             getComponent={ getThread } />
      <Route path="project/:stub"                getComponent={ getProject }>
        <IndexRoute                              getComponent={ getProjectOverview } />
        <Route path="team"                       getComponent={ getProjectTeam } />
        <Route path="files/:path"                getComponent={ getProjectOverview } />
        <Route path="threads"                    getComponent={ getProjectThreads } />
        <Route path="threads/:threadId"          getComponent={ getProjectThread } />
        <Route path="threads/:threadId/edit"     getComponent={ getProjectThread } />
        <Route path="history"                    getComponent={ getProjectCommits } />
        <Route path="history/:commitId"          getComponent={ getProjectCommit } />
        <Route path="pipelines"                  getComponent={ getProjectPipelines } />
        <Route path="pipelines/:pipelineId"      getComponent={ getProjectPipeline } />
        <Route path="pipelines/:pipelineId/steps/:stepId" getComponent={ getProjectPipelineStep } />
        <Route path="settings"                   getComponent={ getProjectSettings }>
          <IndexRoute                            getComponent={ getProjectSettingsGeneral } />
          <Route path="permissions"              getComponent={ getProjectSettingsPermissions } />
          <Route path="threads"                  getComponent={ getProjectSettingsThreads } />
          <Route path="team"                     getComponent={ getProjectSettingsTeam } />
          <Route path="tags"                     getComponent={ getProjectSettingsTags } />
        </Route>
      </Route>
      <Route path="404"                          component={ NotFoundView } />
      <Route path="users/:stub"                  getComponent={ getUser }>
        <IndexRoute                              getComponent={ getUserOverview } />
        <Route path="details"                    getComponent={ getUserDetails } />
        <Route path="followers"                  getComponent={ getUserFollowers } />
        <Route path="following"                  getComponent={ getUserFollowing } />
        <Route path="projects"                   getComponent={ getUserProjects } />
        <Route path="stars"                      getComponent={ getUserStars } />
      </Route>
      <Redirect from="*"                         to="404" />
    </Route>
  )
}
