import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUserStars } from 'stemn-shared/misc/UserStars/UserStars.actions.js'

import UserStars from './UserStars'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  projects: state.userStars[params.stub]
})

const dispatchToProps = {
  getUserStars
}

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getUserStars({ userId: props.params.stub })
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class UserStarsContainer extends Component {
  render() {
    return (
      <UserStars {...this.props} />
    )
  }
}
