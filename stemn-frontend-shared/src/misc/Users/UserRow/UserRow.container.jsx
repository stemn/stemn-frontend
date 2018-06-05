import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getUser } from 'stemn-shared/misc/Users/Users.actions'
import EntityRow from 'stemn-shared/misc/EntityRow'

const stateToProps = ({ users }, { userId }) => ({
  user: users[userId],
})

const dispatchToProps = {
  getUser,
}

const fetchConfigs = [{
  hasChanged: 'userId',
  onChange: (props) => {
    props.getUser({
      userId: props.userId,
      size: 'md',
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserRowContainer extends Component {
  static defaultProps = {
    user: {},
  }
  render() {
    const { user, ...otherProps } = this.props
    return (<EntityRow
      data={ user.data }
      loading={ user.loading }
      { ...otherProps }
    />)
  }
}
