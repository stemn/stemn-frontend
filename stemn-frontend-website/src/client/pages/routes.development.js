/** ***************************************************************

IMPORTANT!
Any changes made here must be made in routes.production
These files should be almost identical. They should only differ by
which routes are async.

**************************************************************** */

import React                                   from 'react'
import { Route, IndexRoute, Redirect }         from 'react-router'


// Routes which are always sync
import AppAuthed                               from 'pages/AppAuthed'
import AppRoot                                 from 'pages/AppRoot'
import AppUnAuthed                             from 'pages/AppUnAuthed'
import NotFoundView                            from 'pages/NotFound'

// Routes that are async in prod
import Download                                from 'pages/Download'
import Explore                                 from 'pages/Explore'
import Field                                   from 'pages/Field'
import FieldOverview                           from 'pages/FieldOverview'
import File                                    from 'pages/File'
import Flow                                    from 'pages/Flow'
import Home                                    from 'pages/Home'
import Landing                                 from 'pages/Landing'
import Login                                   from 'pages/Login'
import Notifications                           from 'pages/Notifications'
import NotificationsAll                        from 'pages/NotificationsAll'
import NotificationsUnread                     from 'pages/NotificationsUnread'
import Onboarding                              from 'pages/Onboarding'
import OnboardingAbout                         from 'pages/OnboardingAbout'
import OnboardingDownload                      from 'pages/OnboardingDownload'
import OnboardingSync                          from 'pages/OnboardingSync'
import OpenSource                              from 'pages/OpenSource'
import Pricing                                 from 'pages/Pricing'
import Privacy                                 from 'pages/Privacy'
import Project                                 from 'pages/Project'
import ProjectCommit                           from 'pages/ProjectCommit'
import ProjectCommits                          from 'pages/ProjectCommits'
import ProjectOverview                         from 'pages/ProjectOverview'
import ProjectPipeline                         from 'pages/ProjectPipeline'
import ProjectPipelineStep                     from 'pages/ProjectPipelineStep'
import ProjectPipelines                        from 'pages/ProjectPipelines'
import ProjectSettings                         from 'pages/ProjectSettings'
import ProjectSettingsGeneral                  from 'pages/ProjectSettingsGeneral'
import ProjectSettingsPermissions              from 'pages/ProjectSettingsPermissions'
import ProjectSettingsTags                     from 'pages/ProjectSettingsTags'
import ProjectSettingsThreads                  from 'pages/ProjectSettingsThreads'
import ProjectSettingsTeam                     from 'pages/ProjectSettingsTeam'
import ProjectThread                           from 'pages/ProjectThread'
import Thread                                  from 'pages/Thread'
import ProjectThreads                          from 'pages/ProjectThreads'
import ProjectTeam                             from 'pages/ProjectTeam'
import Register                                from 'pages/Register'
import Search                                  from 'pages/Search'
import Security                                from 'pages/Security'
import Settings                                from 'pages/Settings'
import SettingsAccount                         from 'pages/SettingsAccount'
import SettingsBilling                         from 'pages/SettingsBilling'
import SettingsEmails                          from 'pages/SettingsEmails'
import SettingsProfile                         from 'pages/SettingsProfile'
import SettingsProfileDetails                  from 'pages/SettingsProfileDetails'
import SettingsProjects                        from 'pages/SettingsProjects'
import Terms                                   from 'pages/Terms'
import User                                    from 'pages/User'
import UserDetails                             from 'pages/UserDetails'
import UserFollowers                           from 'pages/UserFollowers'
import UserFollowing                           from 'pages/UserFollowing'
import UserOverview                            from 'pages/UserOverview'
import UserProjects                            from 'pages/UserProjects'
import UserStars                               from 'pages/UserStars'

import PasswordLost                            from 'stemn-shared/pages/PasswordLost'
import PasswordSet                             from 'stemn-shared/pages/PasswordSet'

export default () => (
  <Route                                       component={ AppRoot }>
    <Route                                     component={ AppAuthed }>
      <Route path="onboarding"                 component={ Onboarding }>
        <IndexRoute                            component={ OnboardingAbout } />
        <Route path="sync"                     component={ OnboardingSync } />
        <Route path="download"                 component={ OnboardingDownload } />
      </Route>
      <Route path="settings"                   component={ Settings }>
        <IndexRoute                            component={ SettingsProfile } />
        <Route path="details"                  component={ SettingsProfileDetails } />
        <Route path="account"                  component={ SettingsAccount } />
        <Route path="billing"                  component={ SettingsBilling } />
        <Route path="emails"                   component={ SettingsEmails } />
        <Route path="projects"                 component={ SettingsProjects } />
      </Route>
      <Route path="notifications"              component={ Notifications }>
        <IndexRoute                            component={ NotificationsUnread } />
        <Route path="unread"                   component={ NotificationsUnread } />
        <Route path="all"                      component={ NotificationsAll } />
      </Route>
    </Route>
    <Route                                     component={ AppUnAuthed }>
      <Route path="login"                      component={ Login } />
      <Route path="register"                   component={ Register } />
    </Route>
    <Route path="/"                            component={ Home } />
    <Route path="password-lost"                component={ PasswordLost } />
    <Route path="/password-reset"              component={ PasswordSet } />
    <Route path="/fields/:fieldId"             component={ Field }>
      <IndexRoute                              component={ FieldOverview } />
    </Route>
    <Route path="/download"                    component={ Download } />
    <Route path="/explore"                     component={ Explore } />
    <Route path="/flow"                        component={ Flow } />
    <Route path="/files/:projectId/:fileId"    component={ File } />
    <Route path="/landing"                     component={ Landing } />
    <Route path="/open-source"                 component={ OpenSource } />
    <Route path="/pricing"                     component={ Pricing } />
    <Route path="/privacy"                     component={ Privacy } />
    <Route path="/search"                      component={ Search } />
    <Route path="/security"                    component={ Security } />
    <Route path="/terms"                       component={ Terms } />
    <Route path="thread/:threadId"             component={ Thread } />
    <Route path="project/:stub"                component={ Project }>
      <IndexRoute                              component={ ProjectOverview } />
      <Route path="team"                       component={ ProjectTeam } />
      <Route path="files/:path"                component={ ProjectOverview } />
      <Route path="threads"                    component={ ProjectThreads } />
      <Route path="threads/:threadId"          component={ ProjectThread } />
      <Route path="threads/:threadId/edit"     component={ ProjectThread } />
      <Route path="history"                    component={ ProjectCommits } />
      <Route path="history/:commitId"          component={ ProjectCommit } />
      <Route path="pipelines"                  component={ ProjectPipelines } />
      <Route path="pipelines/:pipelineId"       component={ ProjectPipeline } />
      <Route path="pipelines/:pipelineId/steps/:stepId" component={ ProjectPipelineStep } />
      <Route path="settings"                   component={ ProjectSettings }>
        <IndexRoute                            component={ ProjectSettingsGeneral } />
        <Route path="permissions"              component={ ProjectSettingsPermissions } />
        <Route path="threads"                  component={ ProjectSettingsThreads } />
        <Route path="team"                     component={ ProjectSettingsTeam } />
        <Route path="tags"                     component={ ProjectSettingsTags } />
      </Route>
    </Route>
    <Route path="404"                          component={ NotFoundView } />
    <Route path="users/:stub"                  component={ User }>
      <IndexRoute                              component={ UserOverview } />
      <Route path="details"                    component={ UserDetails } />
      <Route path="followers"                  component={ UserFollowers } />
      <Route path="following"                  component={ UserFollowing } />
      <Route path="projects"                   component={ UserProjects } />
      <Route path="stars"                      component={ UserStars } />
    </Route>
    <Redirect from="*"                         to="404" />
  </Route>
)
