
import React from 'react';
import { Route, IndexRoute } from 'react-router';


import RootAppPage      from './components/App/RootAppPage';
import AuthedAppPage    from './components/App/AuthedAppPage';
import UnAuthedAppPage  from './components/App/UnAuthedAppPage';

import ChangesPage from './containers/ChangesPage';
import LoginPage from './containers/LoginPage';
//import ErrorPage from './containers/ErrorPage/ErrorPage.container.js';
import FeedPage from './containers/FeedPage';

// Actions
const AuthActions = require('../../shared/actions/auth');

export default (store) => {
  // Init Token
  const authToken = localStorage.getItem('token');
  // Init Http Headers
  store.dispatch(AuthActions.initHttpHeaders('bearer ' + authToken));

  const getUserData = (nextState, replace, callback) => {
    if (!store.getState().auth.user._id) {
      store.dispatch(AuthActions.loadUserData());
      setTimeout(callback,1000);
//      store.dispatch(AuthActions.loadUserData()).then(()=>{
//        callback()
//      }).catch(()=>{
//        store.dispatch(AuthActions.removeHttpHeaders())
//        callback()
//      });
    }
    else{
      callback();
    }
  };

  const requireAuth = (nextState, replace, callback) => {
    if (!store.getState().auth.user._id) {
      replace('/login');
    }
    callback();
  };

  const requireNonAuth = (nextState, replace, callback) => {
    if (store.getState().auth.user._id) {
      replace('/');
    }
    callback();
  };

  return (
    <Route component={RootAppPage} onEnter={getUserData}>
      <Route component={AuthedAppPage} onEnter={requireAuth}>
        <Route path="/" component={ChangesPage}/>
        <Route path="/feed" component={FeedPage}/>
      </Route>
      <Route component={UnAuthedAppPage}>
        <Route onEnter={requireNonAuth}>
          <Route path="/login" component={LoginPage} />
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
