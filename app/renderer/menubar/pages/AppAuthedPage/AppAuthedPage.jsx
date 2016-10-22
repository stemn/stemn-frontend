// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

// Component Core
import React from 'react';
import { has } from 'lodash';

// Sub Components
import Sidebar            from 'app/renderer/menubar/modules/Sidebar/Sidebar.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillReceiveProps(nextProps) {
    const prevProps = this.props;
    console.log();
    if(!nextProps.auth.authToken || !nextProps.auth.user._id){
      nextProps.dispatch(push('/login'))
    }
    if(!has(nextProps, 'params.stub') || nextProps.activeProject != nextProps.params.stub){
      nextProps.dispatch(push(`/project/${nextProps.activeProject}`))
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

function mapStateToProps({ auth, projects }) {
  return {
    auth,
    activeProject: projects.activeProject
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
