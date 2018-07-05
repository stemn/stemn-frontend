import React from 'react'
import cn from 'classnames'
import classes from '../Login/Login.css'
import { Link } from 'react-router'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import Input from 'stemn-shared/misc/Input/Input/Input'

export default class PasswordLost extends React.Component {
  submit = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    this.props.requestPasswordReset({
      email: this.props.auth.passwordLost.email,
    })
  };

  render() {
    const {
      auth,
    } = this.props
    
    return (
      <div className="flex rel-box">
        <div className={ cn(classes.background, 'layout-column layout-align-center-center') }>
          <div className={ cn(classes.panel, 'layout-column', 'layout-align-space-between') } style={ { height: '250px' } }>
            <div className="text-title-3">Get password reset link</div>
            <form onSubmit={ this.submit }>
              <br />
              <Input
                model="auth.passwordLost.email"
                value={ auth.passwordLost.email }
                className="dr-input"
                type="text" 
                placeholder="Email Address"
              />
            </form>
            <div className="layout-row layout-align-start-center">
              <Link to="/login" className="link-primary text-title-5">Back</Link>
              <div className="flex" />
              <ProgressButton className="primary" onClick={ this.submit } disabled={ auth.passwordLost.email.length < 5 }>
                Submit
              </ProgressButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
