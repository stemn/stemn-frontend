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
import { Link } from 'react-router';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Tabs from 'app/renderer/main/components/Tabs/Tabs'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { AuthActions, auth } = this.props;

    return (
    <div className="layout-column layout-align-center-center flex" style={{background: 'rgba(0, 0, 0, 0.05)'}}>
      <div className={classNames(classes.container, 'layout-row')}>
        <div className={classes.imageSection + ' layout-column layout-align-center-center'}
          style={{backgroundImage: 'url(../images/satellite-backgrounds/satellite3.jpg)'}}>
        </div>
        <div className={classes.textSection}>
          <div className={classes.textSectionInner + ' layout-column  layout-align-space-between'}>
            <div className="text-title-3">Sign In</div>
            <div>
              <br />
              <Field model="auth.login.email">
                <input className={classes.input} type="text" placeholder="Email"/>
              </Field>
              <Field model="auth.login.password">
                <input className={classes.input} type="password" placeholder="Password"/>
              </Field>
              <div className="layout-row layout-align-end">
                <div className="flex-50 layout-row">
                  <Button style={{marginLeft: '5px'}}
                    className="primary flex"
                    type="submit"
                    onClick={()=>AuthActions.login({
                    email: auth.login.email,
                    password: auth.login.password
                    })}>
                    Sign In
                  </Button>
                </div>
              </div>
              <br />
              <div className={classes.textDivider}>
                <div>OR</div>
              </div>
              <div className="layout-row" style={{paddingTop: '12px'}}>
                <Button onClick={()=>AuthActions.authenticate('linkedin')}
                style={{marginRight: '5px'}}
                className="flex linkedin"
                type="button">
                  Linkedin
                </Button>
                <Button onClick={()=>AuthActions.authenticate('facebook')}
                style={{marginLeft: '5px'}}
                className="flex facebook"
                type="button">
                  Facebook
                </Button>
              </div>
            </div>
            <div className="layout-row">
              <div>Dont have an account? <Link to="/register" className="link-primary">Register</Link></div>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay show={auth.authLoading}/>
    </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ auth }) {
  return { auth };
}

function mapDispatchToProps(dispatch) {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
