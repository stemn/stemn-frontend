import electron from 'electron';

// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

// Component Core
import React from 'react';

// Sub Components
import TitleBar from 'app/renderer/main/components/TitleBar/TitleBar';
import Sidebar  from 'app/renderer/main/modules/Sidebar/Sidebar.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillReceiveProps(nextProps, prevProps) {
    if(!nextProps.auth.authToken){
      nextProps.dispatch(push('/login'))
    }
  },
  componentDidMount(){
    // Resize the window
    const window = electron.remote.getCurrentWindow();
    window.setMinimumSize(500, 500);
    window.setResizable(true);
//    window.setSize(1200, 720, true);
//    window.setFullScreenable(true);
    window.maximize();
  },
  render() {
    const { children } = this.props
    return (
      <div className="layout-row flex">
        <div className="layout-column">
          <Sidebar params={this.props.params}/>
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
