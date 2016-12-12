// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UsersActions from 'app/shared/actions/users';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import Header from 'app/renderer/main/modules/Header/Header.jsx'
import NavPill from 'app/renderer/main/components/Buttons/NavPill/NavPill'



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    const { auth } = this.props;
    return (
      <div className="layout-column flex">
        <Header>
          <b>Settings</b>
        </Header>
        <div className={classes.container+' layout-row flex scroll-box'}>
          <div style={{width: '250px', marginRight: '15px'}}>
            <div className={classes.panel} style={{padding: '0px'}}>
              <NavPill to="/settings/application">Application</NavPill>
              { auth.authToken
              ? <NavPill to="/settings/account">Account</NavPill>
              : <NavPill to="/login">Login</NavPill> }
            </div>
          </div>
          <div style={{width: '650px'}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );

  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({auth}, {params}) {
  return {
    auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
