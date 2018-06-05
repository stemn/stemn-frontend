import React, { Component } from 'react'
import { get } from 'lodash'
import Link from 'stemn-shared/misc/Router/Link'

export default class UserName extends Component {
  render() {
    const { user } = this.props
    return (
      <Link name="userRoute" params={ { userId: get(user, 'data._id') } }>{ get(user, 'data.name') }</Link>
    )
  }
}
