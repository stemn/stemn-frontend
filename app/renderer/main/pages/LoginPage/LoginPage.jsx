// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as AuthActions from 'app/shared/actions/auth.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './LoginPage.css'

// Sub Components
import {Form , Field } from 'react-redux-form';
import {MdLockOpen} from 'react-icons/lib/md';
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';




/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    const { AuthActions, auth } = this.props

    if(auth.authLoading){
      return (<LoadingOverlay />)
    }
    else{
      return (
        <div className="layout-column layout-align-center-center flex">
          <Form className={classes.form} model="auth.login" onSubmit={AuthActions.login}>
            <h3>Login Form</h3>
            <Field model="auth.login.email">
              <input className={classes.input} type="text" placeholder="Email"/>
            </Field>

            <Field model="auth.login.password">
              <input className={classes.input} type="password" placeholder="Password"/>
            </Field>
            <div className="layout-row layout-align-center"><IconButton type="submit"><MdLockOpen size="22"/>Login</IconButton></div>
          </Form >
          <button type="button" onClick={()=>AuthActions.authenticate('facebook')}>Login Facebook</button>
          <button type="button" onClick={()=>AuthActions.authenticate('dropbox')}>Login Dropbox</button>
          <button type="button" onClick={()=>AuthActions.authenticate('linkedin')}>Login Linkedin</button>
        </div>
      );
    }
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ auth }) {
  return { auth };
}

function mapDispatchToProps(dispatch) {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
