import React                                   from 'react'
import { Route, IndexRoute, Redirect }         from 'react-router'

// Routes that we don't split...
import AppAuthed                               from 'pages/AppAuthed';
import AppRoot                                 from 'pages/AppRoot';
import AppUnAuthed                             from 'pages/AppUnAuthed';
import NotFoundView                            from 'pages/NotFound';

// Route loading utils
const errorLoading = (err)  =>{
  console.error('Dynamic page loading failed', err);
}
const loadRoute = (cb) => (module) => cb(null, module.default);
const getRoute = (systemImport, cb) => systemImport.then(loadRoute(cb)).catch(errorLoading);

// Async Routes
// Split using webpack magic.
// http://moduscreate.com/code-splitting-for-react-router-with-es6-imports/
const getHome                    = (loc, cb) => getRoute(System.import('pages/Home'), cb);
const getFile                    = (loc, cb) => getRoute(System.import('pages/File'), cb);
const getLogin                   = (loc, cb) => getRoute(System.import('pages/Login'), cb);
const getProject                 = (loc, cb) => getRoute(System.import('pages/Project'), cb);
const getProjectCommit           = (loc, cb) => getRoute(System.import('pages/ProjectCommit'), cb);
const getProjectCommits          = (loc, cb) => getRoute(System.import('pages/ProjectCommits'), cb);
const getProjectOverview         = (loc, cb) => getRoute(System.import('pages/ProjectOverview'), cb);
const getProjectSettings         = (loc, cb) => getRoute(System.import('pages/ProjectSettings'), cb);
const getProjectSettingsGeneral  = (loc, cb) => getRoute(System.import('pages/ProjectSettingsGeneral'), cb);
const getProjectSettingsTags     = (loc, cb) => getRoute(System.import('pages/ProjectSettingsTags'), cb);
const getProjectSettingsTasks    = (loc, cb) => getRoute(System.import('pages/ProjectSettingsTasks'), cb);
const getProjectSettingsTeam     = (loc, cb) => getRoute(System.import('pages/ProjectSettingsTeam'), cb);
const getProjectTask             = (loc, cb) => getRoute(System.import('pages/ProjectTask'), cb);
const getProjectTasks            = (loc, cb) => getRoute(System.import('pages/ProjectTasks'), cb);
const getRegister                = (loc, cb) => getRoute(System.import('pages/Register'), cb);
const getSettings                = (loc, cb) => getRoute(System.import('pages/Settings'), cb);
const getSettingsAccount         = (loc, cb) => getRoute(System.import('pages/SettingsAccount'), cb);
const getSettingsBilling         = (loc, cb) => getRoute(System.import('pages/SettingsBilling'), cb);
const getSettingsEmails          = (loc, cb) => getRoute(System.import('pages/SettingsEmails'), cb);
const getSettingsProfile         = (loc, cb) => getRoute(System.import('pages/SettingsProfile'), cb);
const getSettingsProjects        = (loc, cb) => getRoute(System.import('pages/SettingsProjects'), cb);
const getUser                    = (loc, cb) => getRoute(System.import('pages/User'), cb);
const getUserDetails             = (loc, cb) => getRoute(System.import('pages/UserDetails'), cb);
const getUserFollowers           = (loc, cb) => getRoute(System.import('pages/UserFollowers'), cb);
const getUserFollowing           = (loc, cb) => getRoute(System.import('pages/UserFollowing'), cb);
const getUserOverview            = (loc, cb) => getRoute(System.import('pages/UserOverview'), cb);
const getUserProjects            = (loc, cb) => getRoute(System.import('pages/UserProjects'), cb);
const getUserStars               = (loc, cb) => getRoute(System.import('pages/UserStars'), cb);

export default (
  <Route                                       component={AppRoot}>

    <Route                                     component={AppAuthed}>
      <Route path="settings"                   getComponent={getSettings}>
        <IndexRoute                            getComponent={getSettingsProfile}/>
        <Route path="account"                  getComponent={getSettingsAccount}/>
        <Route path="billing"                  getComponent={getSettingsBilling}/>
        <Route path="emails"                   getComponent={getSettingsEmails}/>
        <Route path="projects"                 getComponent={getSettingsProjects}/>
      </Route>
    </Route>

    <Route                                     component={AppUnAuthed}>
      <Route path="login"                      getComponent={getLogin} />
      <Route path="register"                   getComponent={getRegister} />
    </Route>

    <Route path="/"                            getComponent={getHome} />
    <Route path="/files/:projectId/:fileId"    getComponent={getFile} />
    <Route path="project/:stub"                getComponent={getProject}>
      <IndexRoute                              getComponent={getProjectOverview} />
      <Route path="files/:path"                getComponent={getProjectOverview} />
      <Route path="tasks"                      getComponent={getProjectTasks} />
      <Route path="tasks/:taskId"              getComponent={getProjectTask} />
      <Route path="commits"                    getComponent={getProjectCommits} />
      <Route path="commits/:commitId"          getComponent={getProjectCommit} />
      <Route path="settings"                   getComponent={getProjectSettings}>
        <IndexRoute                            getComponent={getProjectSettingsGeneral} />
        <Route path="tasks"                    getComponent={getProjectSettingsTasks} />
        <Route path="team"                     getComponent={getProjectSettingsTeam} />
        <Route path="tags"                     getComponent={getProjectSettingsTags} />
      </Route>
    </Route>
    <Route path="404"                          component={NotFoundView} />
    <Route path="users/:stub"                  getComponent={getUser}>
      <IndexRoute                              getComponent={getUserOverview} />
      <Route path="details"                    getComponent={getUserDetails} />
      <Route path="followers"                  getComponent={getUserFollowers} />
      <Route path="following"                  getComponent={getUserFollowing} />
      <Route path="projects"                   getComponent={getUserProjects} />
      <Route path="stars"                      getComponent={getUserStars} />
    </Route>
    <Redirect from="*"                         to="404" />
  </Route>
)
