// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarActions from 'app/shared/actions/sidebar';
import * as HeaderActions from 'app/shared/actions/header';
import * as AuthActions from 'app/shared/actions/auth';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import styles from './Header.css';

// Sub Components
import {MdMenu} from 'react-icons/lib/md';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    return (
      <div className={styles.toolbar + ' layout-row layout-align-start-center rel-box'}>
        {!this.props.sidebar.show ? <a onClick={()=>{this.props.sidebarActions.toggleSidebar();}}><MdMenu size="25"/></a> : ''}
        <div className={styles.inner + ' layout-row flex'}>{this.props.children}</div>
      </div>
    );
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ header, auth, sidebar }, {location}) {
  return {
    header,
    auth,
    sidebar,
    location
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    headerActions: bindActionCreators(HeaderActions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
