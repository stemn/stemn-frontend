import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import ChangesPage from './containers/ChangesPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ChangesPage} />
  </Route>
);
