// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as AuthActions from 'stemn-shared/misc/Auth/Auth.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './LoginPage.css'

// Sub Components
import Input from 'stemn-shared/misc/Input/Input/Input';
import { Link } from 'react-router';
import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx';
import MdPhoto from 'react-icons/md/photo';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import Tabs from 'stemn-shared/misc/Tabs/Tabs'

import logoSvg from 'stemn-shared/assets/images/astronaut.svg';
const backgroundImages = require.context('stemn-shared/assets/images/satellite-backgrounds');

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
    const parseBackground = (bgNumber) => {
      const total = 8;
      return bgNumber > total ? 1 : bgNumber;
    }
    const backgroundImagePath =  `./satellite-${parseBackground(auth.background)}.jpg`
    const backgroundImage     = { backgroundImage: `url(${backgroundImages(backgroundImagePath)}` };
    
    const formPanel = (
      <div className={classNames(classes.formPanel, 'flex', 'layout-column', 'layout-align-space-between')}>
        <div className={classes.title + ' text-title-3'}>Sign In</div>
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
          <div className={classes.textDivider}><div>OR</div></div>
          <div className="layout-row">
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
          <LoadingOverlay show={auth.authLoading || auth.userLoading}/>
        </form>
        <div className="layout-row">
          <div>Dont have an account? <Link to="/register" className="link-primary">Register</Link></div>
        </div>
      </div>
    );
    
    const brandPanel = (
      <div className={classNames(classes.brandPanel, 'layout-column', 'layout-align-center-center')}>
        <img src={logoSvg} style={{width: '150px'}} draggable="false"/>
      </div>
    );
    
    return (
      <div className="flex rel-box">
        <div className={classes.background} style={backgroundImage}></div>
        <div className={classes.center + ' layout-column layout-align-center-center'}>
          <div className={classNames(classes.mask)}>
            <div className={classNames(classes.backgroundBlurred)} style={backgroundImage}></div>          
          </div>
        </div>
        <div className={classes.center + ' layout-column layout-align-center-center'}>
          <div className={classNames(classes.content, 'layout-row')}>
            {brandPanel}
            {formPanel}
          </div>
        </div>
        <SimpleIconButton
          className={classes.nextBg}
          onClick={AuthActions.nextBackground}
          title="Change background"
          color="white">
          <MdPhoto size={24}/>
        </SimpleIconButton>
      </div>
    )          
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
