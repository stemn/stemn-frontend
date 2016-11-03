
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import http from 'axios';


import AppRootPage                 from './pages/AppRootPage/AppRootPage';
import AppAuthedPage               from './pages/AppAuthedPage/AppAuthedPage';
import AppUnAuthedPage             from './pages/AppUnAuthedPage/AppUnAuthedPage';
import AppEitherPage               from './pages/AppEitherPage/AppEitherPage';

import ProjectChangesPage          from './pages/ProjectChangesPage/ProjectChangesPage.jsx';
import LoginPage                   from './pages/LoginPage/LoginPage.jsx';
import RegisterPage                from './pages/RegisterPage/RegisterPage.jsx';
//import ErrorPage from './containers/ErrorPage/ErrorPage.container.js';

import SettingsPage                from './pages/SettingsPage/SettingsPage.jsx';
import SettingsAccountPage         from './pages/SettingsPage/SettingsAccountPage/SettingsAccountPage.jsx';
import SettingsApplicationPage     from './pages/SettingsPage/SettingsApplicationPage/SettingsApplicationPage.jsx';

import HomePage                    from './pages/HomePage/HomePage.jsx';
import DashboardPage               from './pages/DashboardPage/DashboardPage.jsx';
import ProjectPage                 from './pages/ProjectPage/ProjectPage.container.js';
import ProjectSettingsPage         from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.jsx';
import ProjectSettingsGeneralPage  from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsGeneralPage/ProjectSettingsGeneralPage.jsx';
import ProjectSettingsTasksPage    from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsTasksPage/ProjectSettingsTasksPage.jsx';
import ProjectSettingsTeamPage     from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsTeamPage/ProjectSettingsTeamPage.jsx';
import ProjectFeedPage             from './pages/ProjectFeedPage/ProjectFeedPage.jsx';
import ProjectTaskPage             from './pages/ProjectTaskPage/ProjectTaskPage.jsx';

// Actions
const AuthActions = require('../../shared/actions/auth');


export default (store) => {

  const requireAuth = (nextState, replace, callback) => {
    if (store.getState().auth.authToken) {
      store.dispatch(AuthActions.initHttpHeaders('bearer '+ store.getState().auth.authToken));
      setTimeout(()=>store.dispatch(AuthActions.loadUserData()), 1)
    }
    callback();
  };

  return (
    <Route                                           component={AppRootPage}   onEnter={requireAuth}>
      <Route                                         component={AppAuthedPage}>
        <Route   path="/project/:stub"               component={ProjectPage}>
          <IndexRoute                                component={ProjectChangesPage} />
          <Route path="feed"                         component={ProjectFeedPage}/>
          <Route path="tasks"                        component={ProjectTaskPage}/>
          <Route path="settings"                     component={ProjectSettingsPage}>
            <IndexRoute                              component={ProjectSettingsGeneralPage} />
            <Route path="tasks"                      component={ProjectSettingsTasksPage} />
            <Route path="team"                       component={ProjectSettingsTeamPage} />
          </Route>
        </Route>
        <Route   path="/"                            component={HomePage}/>
        <Route   path="/dashboard"                   component={DashboardPage}/>
        <Route   path="/settings"                    component={SettingsPage}>
          <Route path="/settings/account"            component={SettingsAccountPage}/>
        </Route>
      </Route>
      <Route                                         component={AppUnAuthedPage}>
        <Route path="/login"                         component={LoginPage} />
        <Route path="/register"                      component={RegisterPage} />
      </Route>
      <Route                                         component={AppEitherPage}>
        <Route   path="/settings"                    component={SettingsPage}>
          <Route path="/settings/application"        component={SettingsApplicationPage}/>
        </Route>
      </Route>
    </Route>
  );
};

//
