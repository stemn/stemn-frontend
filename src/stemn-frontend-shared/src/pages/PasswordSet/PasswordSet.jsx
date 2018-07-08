import React from 'react'
import cn from 'classnames'
import classes from '../Login/Login.css'
import { Link } from 'react-router'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import Input from 'stemn-shared/misc/Input/Input/Input'

export default class PasswordSet extends React.Component {
  submit = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    this.props.passwordUpdate({
      newPassword: this.props.auth.passwordSet.password1,
      resetToken: this.props.resetToken,
      redirect: true,
    })
  };

  render() {
    const { auth } = this.props
    const invalid = (auth.passwordSet.password1 != auth.passwordSet.password2) || auth.passwordSet.password1.length < 7

    return (
      <div className="flex rel-box">
        <div className={ cn(classes.background, 'layout-column layout-align-center-center') }>
          <div className={ cn(classes.panel, 'layout-column', 'layout-align-space-between') } style={ { height: '300px' } }>
            <div className="text-title-3">Update your password</div>
            <form onSubmit={ this.submit }>
              <br />
              <Input
                model="auth.passwordSet.password1"
                value={ auth.passwordSet.password1 }
                className="dr-input"
                type="password"
                placeholder="New Password"
              />             
              <Input
                model="auth.passwordSet.password2"
                value={ auth.passwordSet.password2 }
                className="dr-input"
                type="password"
                placeholder="Confirm New Password"
              />
            </form>
            <div className="layout-row layout-align-start-center">
              <Link to="/settings" className="link-primary text-title-5">Back</Link>
              <div className="flex" />
              <ProgressButton className="primary" onClick={ this.submit } disabled={ invalid } loading={ auth.updatePasswordPending }>
                Submit
              </ProgressButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
