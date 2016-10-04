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
    this.props.UsersActions.getUser({userId: this.props.auth.user._id});
  },
  render() {
    const { entityModel, user, auth, AuthActions } = this.props;
    return (
      <div>
        <div className={classes.panel}>
          <h3>Basic Profile Info</h3>
          <Upload uploadId="UserSettingsAvatar"></Upload>
          <br />
          <div className="layout-row">
            <Field className="flex" model={`${entityModel}.profile.firstname`}>
              <input className="dr-input" type="text" placeholder="First Name" style={{marginRight: '7px'}}/>
            </Field>
            <Field className="flex" model={`${entityModel}.profile.lastname`}>
              <input className="dr-input" type="text" placeholder="Last Name" style={{marginLeft: '7px'}}/>
            </Field>
          </div>
          <br />
          <Field model={`${entityModel}.profile.blurb`}>
            <input className="dr-input" type="text" placeholder="Blurb"/>
          </Field>
          <br />
          <div className="layout-row layout-align-end">
            <Button className="primary" onClick={()=>this.linkRemote()}>Update basic info</Button>
          </div>
        </div>

        <div className={classes.panel}>
          <h3>Link Accounts</h3>
          <p>By linking accounts you'll be able to login to STEMN using either Facebook and/or LinkedIn. LinkedIn login won't work on your mobile phone but Facebook works a treat.</p>
          <LinkAccount text="Facebook" isLinked={auth.user.accounts.facebook} linkFn={()=>AuthActions.authenticate('facebook')} unLinkFn={()=>AuthActions.unlink('facebook')}/>
          <LinkAccount text="Linkedin" isLinked={auth.user.accounts.linkedin} linkFn={()=>AuthActions.authenticate('linkedin')} unLinkFn={()=>AuthActions.unlink('linkedin')}/>
        </div>
        <div className={classes.panel}>
          <h3>Sync Accounts</h3>
          <p>Connect your dropbox account to take advantage of STEMN Sync. This will automatically sync your project files to STEMN.</p>
          <LinkAccount text="Dropbox" isLinked={auth.user.accounts.dropbox.id} linkFn={()=>AuthActions.authenticate('dropbox')} unLinkFn={()=>AuthActions.unlink('dropbox')}/>
          <LinkAccount text="Google Drive" isLinked={auth.user.accounts.google.refreshToken} linkFn={()=>AuthActions.authenticate('google')} unLinkFn={()=>AuthActions.unlink('google')}/>
        </div>
       <LoadingOverlay show={auth.authLoading}/>
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
    UsersActions: bindActionCreators(UsersActions, dispatch),
    AuthActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
