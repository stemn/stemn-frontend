// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as AuthActions from 'app/shared/actions/auth.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../LoginPage/LoginPage.css'

// Sub Components
import { Link } from 'react-router';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import Input from 'app/renderer/main/components/Input/Input/Input';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  submit(event) {
    event.preventDefault();
    this.props.AuthActions.register({
      email: this.props.auth.login.email,
      password: this.props.auth.login.password,
      firstname: this.props.auth.login.firstname,
      lastname: this.props.auth.login.lastname
    })
  },
  render() {
    const { AuthActions, auth } = this.props

    return (
      <div className="layout-column layout-align-center-center flex" style={{background: 'rgba(0, 0, 0, 0.05)'}}>
        <div className={classNames(classes.container, 'layout-row')}>
          <div className={classes.imageSection + ' layout-column layout-align-center-center'}
          style={{backgroundImage: 'url(../images/satellite-backgrounds/satellite5.jpg)'}}>
          </div>
          <div className={classes.textSection}>
            <div className={classes.textSectionInner  + ' layout-column  layout-align-space-between'}>
              <div className="text-title-3">Register</div>
              <form onSubmit={this.submit}>
                <br />
                <div className="layout-row">
                  <Input model="auth.login.firstname" value={auth.login.firstname} className={classes.input} style={{marginRight: '5px'}} type="text" placeholder="First name"/>
                  <Input model="auth.login.lastname" value={auth.login.lastname} className={classes.input} style={{marginLeft: '5px'}} type="text" placeholder="Last Name"/>
                </div>
                <Input model="auth.login.email" value={auth.login.email} className={classes.input} type="text" placeholder="Email"/>
                <Input model="auth.login.password" value={auth.login.password} className={classes.input} type="password" placeholder="Password"/>
                <div className="layout-row layout-align-end">
                  <div className="flex-50 layout-row">
                    <Button style={{marginLeft: '5px'}}
                    className="primary flex"
                    type="submit">Register</Button>
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
                  type="button">Linkedin</Button>
                  <Button onClick={()=>AuthActions.authenticate('facebook')}
                  style={{marginLeft: '5px'}}
                  className="flex facebook"
                  type="button">Facebook</Button>
                </div>
              </form>
              <div className="layout-row">
                <div>Already have an account? <Link to="/login" className="link-primary">Login</Link></div>
              </div>
            </div>
            <LoadingOverlay show={auth.authLoading}/>
          </div>
        </div>
      </div>
    );
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
