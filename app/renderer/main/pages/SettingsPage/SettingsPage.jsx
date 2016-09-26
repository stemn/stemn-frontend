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
  componentWillMount() {
    this.props.UsersActions.getUser({userId: this.props.auth.user._id});
  },
  render() {
    return (
      <div className="layout-column flex">
          <Header
          style={{
              background: 'white',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
          Settings
        </Header>
        <div className={classes.container+' layout-row flex scroll-box'}>
          <div style={{width: '250px', marginRight: '15px'}}>
            <div className={classes.panel} style={{padding: '0px'}}>
              <NavPill to="/settings/application">Application</NavPill>
              <NavPill to="/settings/account">Account</NavPill>
            </div>
          </div>
          <div className="layout-column flex">
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
  return {
    UsersActions: bindActionCreators(UsersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
