
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import http from 'axios';


import RootAppPage              from './components/App/RootAppPage';
import AuthedAppPage            from './components/App/AuthedAppPage';
import UnAuthedAppPage          from './components/App/UnAuthedAppPage';

import ProjectChangesPage       from './pages/ProjectChangesPage/ProjectChangesPage.jsx';
import LoginPage                from './pages/LoginPage/LoginPage.jsx';
import RegisterPage             from './pages/RegisterPage/RegisterPage.jsx';
//import ErrorPage from './containers/ErrorPage/ErrorPage.container.js';

import SettingsPage             from './pages/SettingsPage/SettingsPage.jsx';
import SettingsAccountPage      from './pages/SettingsPage/SettingsAccountPage/SettingsAccountPage.jsx';
import SettingsApplicationPage  from './pages/SettingsPage/SettingsApplicationPage/SettingsApplicationPage.jsx';

import HomePage                 from './pages/HomePage/HomePage.jsx';
import ProjectPage              from './pages/ProjectPage/ProjectPage.container.js';
import ProjectSettingsPage      from './pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.jsx';
import ProjectFeedPage          from './pages/ProjectFeedPage/ProjectFeedPage.jsx';

// Actions
const AuthActions = require('../../shared/actions/auth');


export default (store) => {

  const init = (nextState, replace, callback) => {
//    if(store.getState().auth.authToken){
//      store.dispatch(AuthActions.initHttpHeaders('bearer '+ store.getState().auth.authToken));
//    }else{
//      replace('/login');
//    }
//    callback();

//    if (!store.getState().auth.user._id) {
//      console.log(store.getState().auth);
//      store.dispatch(AuthActions.loadUserData());
//      setTimeout(callback, 1000);
////      store.dispatch(AuthActions.loadUserData()).then(()=>{
////        callback()
////      }).catch(()=>{
////        store.dispatch(AuthActions.removeHttpHeaders())
////        callback()
////      });
//    }
//    else{
//      store.dispatch(AuthActions.initHttpHeaders('bearer '+ store.getState().auth.authToken));
//      callback();
//    }
  };

  const requireAuth = (nextState, replace, callback) => {
    if (!store.getState().auth.authToken) {
      replace('/login');
    }
    else{
      store.dispatch(AuthActions.initHttpHeaders('bearer '+ store.getState().auth.authToken));
      setTimeout(()=>store.dispatch(AuthActions.loadUserData()), 1)
    }
    callback();
  };

  const requireNonAuth = (nextState, replace, callback) => {
    if (store.getState().auth.authToken) {
      replace('/');
    }
    callback();
  };

  return (
    <Route                                           component={RootAppPage} >
      <Route                                         component={AuthedAppPage}   onEnter={requireAuth}>
        <Route   path="/project/:stub"               component={ProjectPage}>
          <Route path="changes"       component={ProjectChangesPage}/>
          <Route path="feed"          component={ProjectFeedPage}/>
          <Route path="settings"      component={ProjectSettingsPage}/>
        </Route>
        <Route   path="/"                            component={HomePage}/>
        <Route   path="/settings"                    component={SettingsPage}>
          <Route path="/settings/application"        component={SettingsApplicationPage}/>
          <Route path="/settings/account"            component={SettingsAccountPage}/>
        </Route>
      </Route>
      <Route                                         component={UnAuthedAppPage}>
        <Route onEnter={requireNonAuth}>
          <Route path="/login"                       component={LoginPage} />
          <Route path="/register"                    component={RegisterPage} />
        </Route>
      </Route>
    </Route>
  );
};

//  return (
//    <Route component={RootAppPage} onEnter={getUserData}>
//      <Route component={AuthedAppPage} onEnter={requireAuth}>
//        <Route path="/"      component={ChangesPage}/>
//        <Route path="/feed"  component={FeedPage} />
//      </Route>
//    </Route>
//      <Route component={UnAuthedAppPage}>
//        <Route onEnter={requireNonAuth}>
//          <Route path="/login" component={LoginPage} />
//        </Route>
//
//        <Route path="/error" component={ErrorPage} />
//      </Route>
//  );
