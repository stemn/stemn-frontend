import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LinkAccount from 'stemn-shared/misc/Settings/LinkAccount/LinkAccount'

export default class UserLinkedAccountSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired,
    unlink: PropTypes.func.isRequired,
  }
  render() {
    const { user, authenticate, unlink } = this.props

    const accountTypes = Object.keys(user.accounts)

    return (
      <div>
        <h3>Login</h3>
        <p>By linking social accounts you'll be able to login to STEMN using Facebook and LinkedIn. We never post to your social networks.</p>
        <LinkAccount
          text="Facebook"
          isLinked={ user.accounts.facebook && user.accounts.facebook.id }
          linkFn={ () => authenticate('facebook') }
          unLinkFn={ () => unlink('facebook') }
        />
        <LinkAccount
          text="Linkedin"
          isLinked={ user.accounts.linkedin && user.accounts.linkedin.id }
          linkFn={ () => authenticate('linkedin') }
          unLinkFn={ () => unlink('linkedin') }
        />
      </div>
    )
  }
}
