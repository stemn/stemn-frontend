import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class UserPasswordSettings extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    passwordUpdate: PropTypes.func.isRequired,
  }
  submit = () => {
    const { passwordUpdate, auth } = this.props
    passwordUpdate({
      newPassword: auth.passwordSet.password1,
      oldPassword: auth.passwordSet.oldPassword,
    })
  }
  render() {
    const { auth } = this.props
    const invalid = (auth.passwordSet.password1 !== auth.passwordSet.password2) || auth.passwordSet.password1.length < 7

    return (
      <div>
        <h3>Update your password</h3>
        <p>Change the password for <b>{ auth.user.accounts.local.email }</b></p>
        <Input
          model="auth.passwordSet.oldPassword"
          value={ auth.passwordSet.oldPassword }
          className="dr-input"
          type="password"
          placeholder="Old Password"
          id="user_old_password"
        />
        <br />
        <Input
          model="auth.passwordSet.password1"
          value={ auth.passwordSet.password1 }
          className="dr-input"
          type="password"
          placeholder="New Password"
          id="user_new_password"
        />
        <br />
        <Input
          model="auth.passwordSet.password2"
          value={ auth.passwordSet.password2 }
          className="dr-input"
          type="password"
          placeholder="Confirm New Password"
          id="user_new_password_confirm"
        />
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
            className="primary"
            loading={ auth.updatePasswordPending }
            onClick={ this.submit }
            disabled={ invalid }
          >
            Update
          </ProgressButton>
        </div>
      </div>
    )
  }
}
