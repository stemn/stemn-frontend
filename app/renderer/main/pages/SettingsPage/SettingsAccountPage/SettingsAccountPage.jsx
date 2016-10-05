// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UsersActions from 'app/shared/actions/users';
import * as AuthActions from 'app/shared/actions/auth';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Field } from 'react-redux-form';
import Upload from 'app/renderer/main/modules/Upload/Upload.jsx'
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx'
import LinkAccount from 'app/renderer/main/modules/Settings/LinkAccount/LinkAccount.jsx'
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.usersActions.getUser({userId: this.props.auth.user._id});
  },
  saveUser(){
    this.props.usersActions.saveUser({userId: this.props.user.data});
  },
  render() {
    const { entityModel, user, auth, authActions, usersActions } = this.props;
    const getInner = () => {
      return (
        <div>
          <div className={classes.panel}>
          <h3>Account Avatar</h3>
            <Upload
              model={`${entityModel}.data.profile.firstname`}
              value={user.data.profile.picture}
              uploadId="UserSettingsAvatar"
            />
            <div className="layout-row layout-align-end">
              <Button className="primary" onClick={()=>this.linkRemote()}>Save</Button>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>Basic Profile Info</h3>
            <div className="layout-row">
              <Field className="flex" model={`${entityModel}.data.profile.firstname`}>
                <input className="dr-input" type="text" placeholder="First Name" style={{marginRight: '7px'}}/>
              </Field>
              <Field className="flex" model={`${entityModel}.data.profile.lastname`}>
                <input className="dr-input" type="text" placeholder="Last Name" style={{marginLeft: '7px'}}/>
              </Field>
            </div>
            <br />
            <Field model={`${entityModel}.data.profile.blurb`}>
              <input className="dr-input" type="text" placeholder="Profile blurb"/>
            </Field>
            <br />
            <div className="layout-row layout-align-end">
              <Button className="primary" onClick={()=>this.linkRemote()}>Save</Button>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>Link Accounts</h3>
            <p>By linking accounts you'll be able to login to STEMN using either Facebook and/or LinkedIn. LinkedIn login won't work on your mobile phone but Facebook works a treat.</p>
            <LinkAccount text="Facebook" isLinked={auth.user.accounts.facebook} linkFn={()=>authActions.authenticate('facebook')} unLinkFn={()=>authActions.unlink('facebook')}/>
            <LinkAccount text="Linkedin" isLinked={auth.user.accounts.linkedin} linkFn={()=>authActions.authenticate('linkedin')} unLinkFn={()=>authActions.unlink('linkedin')}/>
          </div>

          <div className={classes.panel}>
            <h3>Sync Accounts</h3>
            <p>Connect your dropbox account to take advantage of STEMN Sync. This will automatically sync your project files to STEMN.</p>
            <LinkAccount text="Dropbox" isLinked={auth.user.accounts.dropbox.id} linkFn={()=>authActions.authenticate('dropbox')} unLinkFn={()=>authActions.unlink('dropbox')}/>
            <LinkAccount text="Google Drive" isLinked={auth.user.accounts.google.refreshToken} linkFn={()=>authActions.authenticate('google')} unLinkFn={()=>authActions.unlink('google')}/>
          </div>
        </div>
      )
    }
    return (
      <div>
        {auth.user && user.data ? getInner() : ''}
        <LoadingOverlay show={auth.authLoading || user.loading}/>
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
