// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import { getUser, saveUser } from 'stemn-shared/misc/Users/Users.actions.js';
import { link, unlink, logout, authenticate } from 'stemn-shared/misc/Auth/Auth.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'electronNew/app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import LinkAccount from 'stemn-shared/misc/Settings/LinkAccount/LinkAccount.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Input from 'stemn-shared/misc/Input/Input/Input';
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'
import UserProfileSettings from 'stemn-shared/misc/UserSettings/UserProfileSettings'
import UserLinkedAccountSettings from 'stemn-shared/misc/UserSettings/UserLinkedAccountSettings'
import UserCloudProviderSettings from 'stemn-shared/misc/UserSettings/UserCloudProviderSettings'


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.getUser({
      userId: this.props.auth.user._id,
      force: true
    });
  },
  saveUser(){
    this.props.saveUser({user: this.props.user.data});
  },
  render() {
    const { entityModel, user, auth, authenticate, link, unlink, logout } = this.props;
    const getInner = () => {
      return (
        <div>
          <div className={classes.panel}>
            <UserProfileSettings
              user={ user }
              userModel={ entityModel }
              saveUser={ this.saveUser }
            />
          </div>
          <div className={classes.panel}>
            <UserLinkedAccountSettings
              user={ auth.user }
              authenticate={ authenticate }
              unlink={ unlink }
            />
          </div>
          <div className={classes.panel}>
            <UserCloudProviderSettings
              user={ auth.user }
              authenticate={ authenticate }
              unlink={ unlink }
            />
          </div>
          <div className={classes.panel}>
            <h3>Logout</h3>
            <p>Logout from this account.</p>
            <div className="layout-row layout-align-end">
              <ProgressButton className="warn" onClick={logout}>Logout</ProgressButton>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="rel-box" style={{minHeight: '200px'}}>
        {auth.user && user && user.data ? getInner() : ''}
        <LoadingOverlay show={auth.authLoading || !user || !user.data}/>
      </div>
    );
  }
});

//          <div className={classes.panel}>
//            <h3>Beta</h3>
//            <p>Invite your friends to the <a className="link-primary" href="https://github.com/Stemn/Stemn-Desktop/releases">Stemn beta</a> using your access code below and get rewarded for each referral. Email <a className="link-primary" href="mailto:rewards@stemn.com">rewards@stemn.com</a> for more info.</p>
//            <TextDisplayBox>{user.data._id}</TextDisplayBox>
//          </div>

///////////////////////////////// CONTAINER /////////////////////////////////


function mapStateToProps({auth, users}, {params}) {
  return {
    auth,
    user: users[auth.user._id],
    entityModel: `users.${auth.user._id}`
  };
}

const mapDispatchToProps = {
  saveUser,
  getUser,
  logout,
  authenticate,
  unlink,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
