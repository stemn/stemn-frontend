// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UsersActions from 'stemn-frontend-shared/src/redux/actions/users';
import * as AuthActions from 'stemn-frontend-shared/src/misc/Auth/Auth.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'electron/app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import Upload from 'stemn-frontend-shared/src/misc/Upload/Upload.jsx'
import ProgressButton from 'stemn-frontend-shared/src/misc/Buttons/ProgressButton/ProgressButton.jsx'
import LinkAccount from 'stemn-frontend-shared/src/misc/Settings/LinkAccount/LinkAccount.jsx'
import LoadingOverlay from 'stemn-frontend-shared/src/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Input from 'stemn-frontend-shared/src/misc/Input/Input/Input';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.usersActions.getUser({userId: this.props.auth.user._id});
  },
  saveUser(){
    this.props.usersActions.saveUser({user: this.props.user.data});
  },
  render() {
    const { entityModel, user, auth, authActions, usersActions } = this.props;
    const getInner = () => {
      return (
        <div>
          <div className={classes.panel}>
            <h3>Profile Info</h3>
            <div className="layout-row layout-align-start-center" style={{margin: '30px 0'}}>
              <Upload
                square={true}
                model={`${entityModel}.data.profile.picture`}
                value={user.data.profile.picture}
                uploadId="UserSettingsAvatar"
              />
              <div className="flex text-center">
                { user.data.profile.picture ? <p>Looking good!</p> : <p>Add a profile photo.</p> }
              </div>
            </div>
            <div className="layout-row">
              <Input
                model={`${entityModel}.data.profile.firstname`}
                value={user.data.profile.firstname}
                className="dr-input flex"
                type="text"
                placeholder="First Name"
                style={{marginRight: '7px'}}
              />
              <Input
                model={`${entityModel}.data.profile.lastname`}
                value={user.data.profile.lastname}
                className="dr-input flex"
                type="text"
                placeholder="Last Name"
                style={{marginLeft: '7px'}}
              />
            </div>
            <br />
            <Input
              model={`${entityModel}.data.profile.blurb`}
              value={user.data.profile.blurb}
              className="dr-input"
              type="text"
              placeholder="Profile blurb"
            />
            <br />
            <div className="layout-row layout-align-end">
              <ProgressButton
                className="primary"
                loading={user.savePending}
                onClick={this.saveUser}>
                Save Profile
              </ProgressButton>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>Login</h3>
            <p>By linking social accounts you'll be able to login to STEMN using Facebook and LinkedIn. We never post to your social networks.</p>
            <LinkAccount
              text="Facebook"
              isLinked={auth.user.accounts.facebook}
              linkFn={()=>authActions.authenticate('facebook')}
              unLinkFn={()=>authActions.unlink('facebook')}/>
            <LinkAccount
              text="Linkedin"
              isLinked={auth.user.accounts.linkedin}
              linkFn={()=>authActions.authenticate('linkedin')}
              unLinkFn={()=>authActions.unlink('linkedin')}/>
          </div>

          <div className={classes.panel}>
            <h3>Cloud Providers</h3>
            <p>Link your cloud file storage to STEMN to track changes to your files.</p>
            <LinkAccount
              text="Dropbox"
              isLinked={auth.user.accounts.dropbox && auth.user.accounts.dropbox.id}
              linkFn={()=>authActions.authenticate('dropbox')}
              unLinkFn={()=>authActions.unlink('dropbox')}
              email={auth.user.accounts.dropbox && auth.user.accounts.dropbox.email ? auth.user.accounts.dropbox.email : ''}/>
            <LinkAccount
              text="Google Drive"
              isLinked={auth.user.accounts.google &&  auth.user.accounts.google.refreshToken}
              linkFn={()=>authActions.authenticate('google')}
              unLinkFn={()=>authActions.unlink('google')}
              email={auth.user.accounts.google && auth.user.accounts.google.email ? auth.user.accounts.google.email : ''}/>
          </div>

          <div className={classes.panel}>
            <h3>Logout</h3>
            <p>Logout from this account.</p>
            <div className="layout-row layout-align-end">
              <ProgressButton className="warn" onClick={authActions.logout}>Logout</ProgressButton>
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

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({auth, users}, {params}) {
  return {
    auth,
    user: users[auth.user._id],
    entityModel: `users.${auth.user._id}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(UsersActions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
