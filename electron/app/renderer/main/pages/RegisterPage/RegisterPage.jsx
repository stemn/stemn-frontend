// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as AuthActions from 'electron/app/shared/modules/Auth/Auth.actions.js';


// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../LoginPage/LoginPage.css'

// Sub Components
import { Link } from 'react-router';
import Button from 'electron/app/renderer/main/components/Buttons/Button/Button.jsx';
import Input from 'electron/app/renderer/main/components/Input/Input/Input';
import SimpleIconButton from 'electron/app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton.jsx';
import MdPhoto from 'react-icons/md/photo';
import LoadingOverlay from 'electron/app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

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
    const { AuthActions, auth } = this.props;
    const parseBackground = (bgNumber) => {
      const total = 8;
      return (!bgNumber || bgNumber) > total ? 1 : bgNumber;
    }
    const backgroundImage = { backgroundImage: `url(../images/satellite-backgrounds/satellite-${parseBackground(auth.background+1)}.jpg)` };
    
    const formPanel = (
      <div className={classNames(classes.formPanel, 'flex', 'layout-column', 'layout-align-space-between')}>
        <div className={classes.title + ' text-title-3'}>Register</div>
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
           <div className={classes.textDivider}><div>OR</div></div>
           <div className="layout-row">
             <Button onClick={()=>AuthActions.authenticate('linkedin')}
             style={{marginRight: '5px'}}
             className="flex linkedin"
            type="button">Linkedin</Button>
            <Button onClick={()=>AuthActions.authenticate('facebook')}
            style={{marginLeft: '5px'}}
            className="flex facebook"
            type="button">Facebook</Button>
          </div>
          <LoadingOverlay show={auth.authLoading}/>
        </form>
        <div className="layout-row">
          <div>Already have an account? <Link to="/login" className="link-primary">Login</Link></div>
        </div>
      </div>
    );
    
    const brandPanel = (
      <div className={classNames(classes.brandPanel, 'layout-column', 'layout-align-center-center')}>
        <img src="../images/astronaut.svg" style={{width: '150px'}} draggable="false"/>
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
