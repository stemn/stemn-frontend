// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SettingsActions from 'app/shared/actions/settings';
import * as UsersActions from 'app/shared/actions/users';
import * as AuthActions from 'app/shared/actions/auth';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Field } from 'react-redux-form';
import { Link } from 'react-router';
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx'



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.UsersActions.getUser({userId: this.props.auth.user._id});
  },
  render() {
    const { entityModel, user, auth, AuthActions } = this.props;
    console.log(this.props);
    return (
      <div className="layout-column flex">
        <div className={classes.container+' layout-row layout-align-center flex scroll-box'}>
          <div style={{width: '600px'}}>

            <div className={classes.panel}>
              <h3>Privacy</h3>
              <p>Help us improve by sending anonymous usage data</p>
              <Toggle model="settings.privacy" value={this.props.settings.privacy} />
            </div>
          </div>
         </div>
      </div>
    );

  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({settings, auth, users}, {params}) {
  return {
    settings,
    auth,
    user: users[auth.user._id],
    entityModel: `users.${auth.user._id}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    SettingsActions: bindActionCreators(SettingsActions, dispatch),
    UsersActions: bindActionCreators(UsersActions, dispatch),
    AuthActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
