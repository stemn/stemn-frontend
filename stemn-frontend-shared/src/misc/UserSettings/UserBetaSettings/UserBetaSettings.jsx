import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'

export default class UserBetaSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }
  render() {
    const { user } = this.props
    return (
      <div>
        <h3>Beta</h3>
        <p>Invite your friends to the <a className="link-primary" href="https://github.com/Stemn/Stemn-Desktop/releases">Stemn beta</a> using your access code below and get rewarded for each referral. Email <a className="link-primary" href="mailto:rewards@stemn.com">rewards@stemn.com</a> for more info.</p>
        <TextDisplayBox>{ user._id }</TextDisplayBox>
      </div>
    )
  }
}
