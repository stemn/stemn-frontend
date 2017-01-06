// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
//import * as SidebarActions from 'electron/app/shared/actions/sidebar';
const SidebarActions = {};

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Header.css';

// Sub Components
import MdMenu from 'react-icons/md/menu';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { dispatch, children, sidebar } = this.props;
    const styles = this.props.absolute ? {position: 'absolute'} : this.props.style;
    return (
      <div className={classes.toolbar + ' layout-row layout-align-start-center rel-box'} style={styles}>
        <div className={classes.dragger}></div>
        <div className={classes.inner + ' layout-row layout-align-start-center flex'}>{children}</div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ header, auth, sidebar }, {location}) {
  return {
    header,
    auth,
    sidebar,
    location
  };
}

//        {!sidebar.show ? <a onClick={() => dispatch(SidebarActions.toggleSidebar())} style={{marginRight: '15px'}}><MdMenu size="25"/></a> : ''}


export default connect(mapStateToProps)(Component);
