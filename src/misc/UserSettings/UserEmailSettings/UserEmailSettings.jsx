import React, { Component, PropTypes } from 'react'
import { compact } from 'lodash'

import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'

export default class UserEmailSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateEmail: PropTypes.func.isRequired,
  }
  render () {
    const { user, updateEmail } = this.props
    const accountTypes = Object.keys(user.accounts)
    const emails = compact(accountTypes.map((accountType) => user.accounts[accountType].email))
    return (
      <div>
        <h3>Change Email</h3>
        <p>Primary Email</p>
        <div>{ emails.join() }</div>
        <br />
        <div className='layout-row layout-align-end'>
          <ProgressButton
            className='primary'
            onClick={ () => updateEmail(emails[0]) }>
            Update Email
          </ProgressButton>
        </div>
      </div>
    )
  }
}
