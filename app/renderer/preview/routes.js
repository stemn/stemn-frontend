import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AppRootPage           from './pages/AppRootPage/AppRootPage.jsx';
import PreviewPage           from './pages/PreviewPage/PreviewPage.jsx';

export default (store) => {
  return (
    <Route        component={AppRootPage}     path="/">
      <IndexRoute component={PreviewPage} />
    </Route>
  );
}
