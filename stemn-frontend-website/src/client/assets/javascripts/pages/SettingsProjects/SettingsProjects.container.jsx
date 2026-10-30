import React from 'react'
import { connect } from 'react-redux'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import SettingsProjects from './SettingsProjects'

const stateToProps = ({ auth }) => ({
  currentUser: auth.user,
})

/** The current user's projects (private included): the `projects.byUser` query */
const SettingsProjectsContainer = (props) => {
  const projects = useUserProjects(props.currentUser._id, props.currentUser._id)
  return <SettingsProjects {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps)(SettingsProjectsContainer)
