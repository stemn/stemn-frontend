import React from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'

import UserProjects from './UserProjects'

const stateToProps = ({ users, auth }, { params }) => ({
  user: users[params.stub],
  currentUserId: auth.user._id,
})

const dispatchToProps = {}

const fetchConfigs = []

const UserProjectsContainer = (props) => {
  const projects = useUserProjects(props.params.stub, props.currentUserId)
  return <UserProjects {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(UserProjectsContainer))
