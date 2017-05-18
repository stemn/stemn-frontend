import React from 'react';
import classNames from 'classnames';
import classes from '../Login/Login.css'
import { Link } from 'react-router';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';
import Input from 'stemn-shared/misc/Input/Input/Input';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default React.createClass({
  submit(event) {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    this.props.passwordUpdate({
      newPassword: this.props.auth.passwordSet.password1,
      resetToken: 'test',
    })
  },
  render() {
    const { auth } = this.props;
    const invalid = (auth.passwordSet.password1 != auth.passwordSet.password2) || auth.passwordSet.password1.length < 7
    
    return (
      <div className="flex rel-box">
        <div className={ classNames(classes.background, 'layout-column layout-align-center-center') }>
          <div className={ classNames(classes.panel, 'layout-column', 'layout-align-space-between') } style={ { height: '300px' } }>
            <div className="text-title-3">Update your password</div>
            <form onSubmit={ this.submit }>
              <br />
              <Input
                model="auth.passwordSet.password1"
                value={ auth.passwordSet.password1 }
                className="dr-input"
                type="text" 
                placeholder="New Password"
              />             
              <Input
                model="auth.passwordSet.password2"
                value={ auth.passwordSet.password2 }
                className="dr-input"
                type="text" 
                placeholder="Confirm New Password"
              />
            </form>
            <div className="layout-row layout-align-start-center">
              <Link to="/login" className="link-primary text-title-5">Back</Link>
              <div className="flex" />
              <ProgressButton className="primary" onClick={ this.submit } disable={ invalid }>
                Submit
              </ProgressButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
