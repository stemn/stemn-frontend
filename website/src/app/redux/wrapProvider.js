import React from 'react';
import store from './store.js';
import { Provider } from 'react-redux';

export default (Component, propTypes) => {
  return React.createClass({
    propTypes: propTypes,
    render() {
      return (
        <Provider store={store}>
          <Component { ...this.props } />
        </Provider>
      )
    }
  })
};