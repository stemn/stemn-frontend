// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as AuthActions from 'app/shared/modules/Auth/Auth.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './LoginPage.css'

// Sub Components
import Input from 'app/renderer/main/components/Input/Input/Input';
import { Link } from 'react-router';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Tabs from 'app/renderer/main/components/Tabs/Tabs'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  submit(event) {
    event.preventDefault();
    this.props.AuthActions.login({
      email: this.props.auth.login.email,
      password: this.props.auth.login.password
    })
  },
  render() {
    const { AuthActions, auth } = this.props;
    
    const backgroundImage = { backgroundImage: 'url(../images/satellite-backgrounds/satellite3.jpg)' };
    
    const formPanel = (
      <div className={classNames(classes.formPanel, 'flex', 'layout-column', 'layout-align-space-between')}>
        <div className="text-title-3">Sign In</div>
        <form onSubmit={this.submit}>
          <br />
          <Input 
            model="auth.login.email" 
            value={auth.login.email}
            className={classes.input} 
            type="text" 
            placeholder="Email"
          />
          <Input 
            model="auth.login.password" 
            value={auth.login.password}
            className={classes.input} 
            type="password" 
            placeholder="Password"
          />
          <div className="layout-row layout-align-end">
            <div className="flex-50 layout-row">
              <Button style={{marginLeft: '5px'}}
                className="primary flex"
                type="submit">
                Sign In
              </Button>
            </div>
          </div>
          <br />
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
        </form>
        <div className="layout-row">
          <div>Dont have an account? <Link to="/register" className="link-primary">Register</Link></div>
        </div>
        <LoadingOverlay show={auth.authLoading || auth.userLoading}/>
      </div>
    );
    
    const brandPanel = (
      <div className={classNames(classes.brandPanel, 'layout-column', 'layout-align-center-center')}>
        Logo here?
      </div>
    );
    
    return (
      <div className="flex rel-box">
        <div className={classes.background} style={backgroundImage}></div>
        <div className={classes.center}>
          <div className={classNames(classes.mask)}>
            <div className={classNames(classes.backgroundBlurred)} style={backgroundImage}></div>          
          </div>
        </div>
        <div className={classes.center}>
          <div className={classNames(classes.content, 'layout-row')}>
            {brandPanel}
            {formPanel}
          </div>
        </div>
      </div>
    )
//          <div className={classes.textDivider}>
//            <div>OR</div>
//          </div>

//          <div className={classNames(classes.content, 'layout-row')} style={backgroundImage}>
//          </div>
          
//    return (
//    <div className="layout-column layout-align-center-center flex" style={{background: 'rgba(0, 0, 0, 0.05)'}}>
//      <div className={classNames(classes.container, 'layout-row')}>
//        <div className={classes.imageSection + ' layout-column layout-align-center-center'}
//          style={{backgroundImage: 'url(../images/satellite-backgrounds/satellite3.jpg)'}}>
//        </div>
//        <div className={classes.textSection}>
//          <div className={classes.textSectionInner + ' layout-column  layout-align-space-between'}>

//        </div>
//      </div>
//    </div>
//    );
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
