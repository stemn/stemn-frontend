import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { omit } from 'lodash';
import { push } from 'react-router-redux';
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';

/***************************************************************************

This link component makes it easy change route (and focus) on any renderer
window.

Example:
  <Link
    path={`/project/${item.data.project}/feed`}
    query={{ item: item.data._id }}
    scope="main"
    show={true}>
    Some link here
  </Link>

***************************************************************************/

const propTypesObject = {
  children: PropTypes.node.isRequired,      // Child element
  dispatch: PropTypes.func.isRequired,      // Dispatch function
  path: PropTypes.string,                   // Router path, eg -> '/projects/projectId/settings'
  query: PropTypes.object,                  // Query param object
  scope: PropTypes.string,                  // The renderer window to change, eg -> 'main' || 'menubar'
  show: PropTypes.bool                      // Should the window show/focus?
};

const Link = React.createClass({
  render() {
    const propNames = Object.keys(propTypesObject);
    const { children, dispatch, path, query, scope, show } = this.props;

    const link = () => {
      // Dispatch a standard react-router-redux action
      // We include the scope on the state.meta
      // This state.meta is movie up to the root action object
      // inside the Router.middleware
      dispatch(push({
        pathname : path,
        query    : query,
        state    : {meta : {scope: [scope]}}
      }))
      // Dispatch the show event if required
      if(scope && show){
        dispatch(ElectronWindowsActions.show(scope))
      }
    };

    return (
      <a onClick={link} { ...omit(this.props, propNames) }>
        {children}
      </a>
    )
  }
});
Link.propTypes = propTypesObject;

export default connect()(Link);
