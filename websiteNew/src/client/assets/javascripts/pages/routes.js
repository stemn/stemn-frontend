import React                                   from 'react'
import { Route, IndexRoute, Redirect }         from 'react-router'

import AppAuthed                               from './AppAuthed'
import AppRoot                                 from './AppRoot'
import AppUnAuthed                             from './AppUnAuthed'
import File                                    from './File'
import Home                                    from './Home'
import LoginView                               from './Login'
import NotFoundView                            from 'pages/NotFound'
import ProjectCommit                           from './ProjectCommit'
import ProjectCommits                          from './ProjectCommits'
import ProjectOverview                         from './ProjectOverview'
import ProjectSettings                         from './ProjectSettings'
import ProjectSettingsGeneral                  from './ProjectSettingsGeneral'
import ProjectSettingsTasks                    from './ProjectSettingsTasks'
import ProjectSettingsTeam                     from './ProjectSettingsTeam'
import ProjectSettingsTags                     from './ProjectSettingsTags'
import ProjectTask                             from './ProjectTask'
import ProjectTasks                            from './ProjectTasks'
import ProjectView                             from './Project'
import Register                                from './Register'
import Settings                                from './Settings'
import SettingsAccount                         from './SettingsAccount'
import SettingsBilling                         from './SettingsBilling'
import SettingsEmails                          from './SettingsEmails'
import SettingsProfile                         from './SettingsProfile'
import SettingsProjects                        from './SettingsProjects'
import User                                    from './User'
import UserFollowers                           from './UserFollowers'
import UserFollowing                           from './UserFollowing'
import UserOverview                            from './UserOverview'
import UserProjects                            from './UserProjects'
import UserStars                               from './UserStars'

export default (
  <Route                                       component={AppRoot}>

    <Route                                     component={AppAuthed}>
      <Route path="settings"                   component={Settings}>
        <IndexRoute                            component={SettingsProfile}/>
        <Route path="account"                  component={SettingsAccount}/>
        <Route path="billing"                  component={SettingsBilling}/>
        <Route path="emails"                   component={SettingsEmails}/>
        <Route path="projects"                 component={SettingsProjects}/>
      </Route>
    </Route>

    <Route                                     component={AppUnAuthed}>
      <Route path="login"                      component={LoginView} />
      <Route path="register"                   component={Register} />
    </Route>

    <Route path="/"                            component={Home} />
    <Route path="/files/:projectId/:fileId"    component={File} />
    <Route path="project/:stub"                component={ProjectView}>
      <IndexRoute                              component={ProjectOverview} />
      <Route path="files/:path"                component={ProjectOverview} />
      <Route path="tasks"                      component={ProjectTasks} />
      <Route path="tasks/:taskId"              component={ProjectTask} />
      <Route path="commits"                    component={ProjectCommits} />
      <Route path="commits/:commitId"          component={ProjectCommit} />
      <Route path="settings"                   component={ProjectSettings}>
        <IndexRoute                            component={ProjectSettingsGeneral} />
        <Route path="tasks"                    component={ProjectSettingsTasks} />
        <Route path="team"                     component={ProjectSettingsTeam} />
        <Route path="tags"                     component={ProjectSettingsTags} />
      </Route>
    </Route>
    <Route path="404"                          component={NotFoundView} />
    <Route path="users/:stub"                  component={User}>
      <IndexRoute                              component={UserOverview} />
      <Route path="followers"                  component={UserFollowers} />
      <Route path="following"                  component={UserFollowing} />
      <Route path="projects"                   component={UserProjects} />
      <Route path="stars"                      component={UserStars} />
    </Route>
    <Redirect from="*"                         to="404" />
  </Route>
)
