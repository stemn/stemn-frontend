import React from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'

import UserDetails from './UserDetails'

const stateToProps = (state, { params }) => ({
  user: state.users[params.stub],
  currentUserId: state.auth.user._id,
})

const dispatchToProps = {}

const fetchConfigs = []

const UserDetailsContainer = (props) => {
  const projects = useUserProjects(props.params.stub, props.currentUserId)
  return <UserDetails {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(UserDetailsContainer))
