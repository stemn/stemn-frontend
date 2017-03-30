import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import FriendsView from 'features/friends/components/FriendsView';
import NotFoundView from 'pages/NotFound';
import SettingsView from './Settings';
import LoginView from './Login';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={FriendsView} />
    <Route path="404" component={NotFoundView} />
    <Route path="settings" component={SettingsView} />
    <Route path="login" component={LoginView} />
    <Redirect from="*" to="404" />
  </Route>
);
