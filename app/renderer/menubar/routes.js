import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AppRootPage      from './pages/AppRootPage/AppRootPage.jsx';
import HomePage         from './pages/HomePage/HomePage.jsx';
import LoginPage        from './pages/LoginPage/LoginPage.jsx';
import ProjectPage      from './pages/ProjectPage/ProjectPage.jsx';
import AppAuthedPage    from './pages/AppAuthedPage/AppAuthedPage.jsx';
import AppUnAuthedPage  from './pages/AppUnAuthedPage/AppUnAuthedPage.jsx';

const AuthActions = require('../../shared/actions/auth');

export default (store) => {

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
    <Route           component={AppRootPage}     path="/">
      <Route         component={AppAuthedPage}   onEnter={requireAuth}>
        <IndexRoute  component={HomePage} />
        <Route       component={ProjectPage}     path="/project/:stub"/>
      </Route>
      <Route         component={AppUnAuthedPage} onEnter={requireNonAuth}>
        <Route       component={LoginPage}       path="/login"/>
      </Route>
    </Route>
  );
}
