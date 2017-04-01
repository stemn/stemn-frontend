import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from '../pages/routes';

const Root = ({ store, history }) => {
  let ComponentEl = (
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  );

  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('../modules/DevTools').default;
//          {!window.devToolsExtension ? <DevTools /> : null}
    ComponentEl = (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes} />
        </div>
      </Provider>
    );
  }

  return ComponentEl;
};


Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default Root;
