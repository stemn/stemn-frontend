import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Component from './UserSearch.jsx';

import * as UserSearchActions from './UserSearch.actions.js';


function mapStateToProps({userSearch}, otherProps) {
  return {
    userSearch: userSearch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    UserSearchActions: bindActionCreators(UserSearchActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
