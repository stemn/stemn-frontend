import React from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import { getUser } from 'stemn-shared/misc/Users/Users.actions'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'

import User from './User'

const stateToProps = ({ users, auth }, { params }) => ({
  user: users[params.stub],
  currentUser: auth.user,
})

const dispatchToProps = {
  getUser,
}

const fetchConfigs = [
  {
    hasChanged: 'params.stub',
    onChange: (props) => {
      props.getUser({
        userId: props.params.stub,
        force: true,
      })
    },
  },
]

/** The user's projects are the `projects.byUser` query (shared with the overview, projects and details tabs) */
const UserContainer = (props) => {
  const projects = useUserProjects(props.params.stub, props.currentUser._id)
  return <User {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(UserContainer))
