import React from 'react'
import { connect } from 'react-redux'
import { useUserProjects } from 'stemn-shared/api/queries/projects'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import MyProjectsPanel from './MyProjectsPanel'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

const stateToProps = ({ auth }) => ({
  user: auth.user,
})

const dispatchToProps = {
  newProject: () => showModal({ modalType: ProjectNewModalName }),
}

/** The dashboard's "my projects" panel: the current user's `projects.byUser` query */
const MyProjectsPanelContainer = (props) => {
  const projects = useUserProjects(props.user._id, props.user._id)
  return <MyProjectsPanel {...props} projects={toLegacyEntity(projects)} />
}

export default connect(stateToProps, dispatchToProps)(MyProjectsPanelContainer)
