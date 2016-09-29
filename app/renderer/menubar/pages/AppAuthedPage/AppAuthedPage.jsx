// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

// Component Core
import React from 'react';

// Sub Components
import Sidebar            from 'app/renderer/menubar/modules/Sidebar/Sidebar.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillReceiveProps(nextProps, prevProps) {
    if(!nextProps.auth.authToken){
      nextProps.dispatch(push('/login'))
    }
  },
  render() {
    const { children } = this.props

    return (
      <div className="layout-column flex">
        {children}
        <Sidebar />
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
