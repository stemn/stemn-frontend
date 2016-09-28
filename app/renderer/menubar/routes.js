import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './pages/LoginPage/LoginPage.jsx';

const AuthActions = require('../../shared/actions/auth');

export default (store) => {

  const requireAuth = (nextState, replace, callback) => {
    console.log('reqauth');
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
    console.log('notAuth');
    if (store.getState().auth.authToken) {
      replace('/');
    }
    callback();
  };

  return (
    <Route path="/" component={App}>
      <Route onEnter={requireAuth}>
        <IndexRoute component={HomePage} />
        <Route path="/project/:stub/changes" component={HomePage} />
      </Route>
      <Route onEnter={requireNonAuth}>
        <Route path="/login" component={LoginPage} />
      </Route>
    </Route>
  );
}
