import electron from 'electron';

// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

// Component Core
import React from 'react';

// Sub Components
import TitleBar from 'stemn-frontend-shared/src/misc/TitleBar/TitleBar';
import Sidebar  from 'stemn-frontend-shared/src/misc/Sidebar/Sidebar.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { children, auth } = this.props;
    const isAuthed = auth.authToken && auth.user._id;

    return (
      <div className="layout-row flex">
        <div className="layout-column">
          { isAuthed ? <Sidebar params={this.props.params}/> : null }
        </div>
        <div className="layout-column flex rel-box">
          <TitleBar theme="dark"/>
          {children}
        </div>
      </div>
    )
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ auth }) {
  return { auth };
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
