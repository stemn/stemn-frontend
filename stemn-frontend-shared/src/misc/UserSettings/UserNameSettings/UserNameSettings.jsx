import React, { Component } from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class UserNameSettings extends Component {
//  static propTypes = {
//    updateUsername: PropTypes.func.isRequired,
//    username: PropTypes.string.isRequired,
//  }
  render() {
    const { updateUsername, username, usernameModel } = this.props
    return (
      <div>
        <h3>Update Username</h3>
        <p>Your profile will be available at: stemn.com/users/{ username }</p>
        <Input
          model={ usernameModel }
          value={ username }
          className="dr-input"
          type="text"
          placeholder="Username"
        />
        <br />

        <div className="layout-row layout-align-end">
          <ProgressButton
            className="primary"
            onClick={ updateUsername }
          >
            Update Username
          </ProgressButton>
        </div>
      </div>
    )
  }
}
