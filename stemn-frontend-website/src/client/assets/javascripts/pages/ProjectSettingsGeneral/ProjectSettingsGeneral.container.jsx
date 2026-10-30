import React from 'react'
import { connect } from 'react-redux'

import ProjectSettingsGeneral from './ProjectSettingsGeneral'
import { confirmLinkRemote, confirmDeleteProject } from 'stemn-shared/misc/Projects/Projects.actions'
import { useSaveProject } from 'stemn-shared/api/queries/projects'

const stateToProps = ({ projects, auth }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const projectModel = `projects.data.${projectId}`

  return {
    project,
    projectModel,
    auth,
  }
}

const dispatchToProps = {
  confirmLinkRemote,
  confirmDeleteProject,
}

/** The form still edits `projects.data[id]` (Redux); saving is the projects update mutation */
const ProjectSettingsGeneralContainer = (props) => {
  const { saveProject, savePending } = useSaveProject()
  const project = props.project && { ...props.project, savePending }
  return <ProjectSettingsGeneral {...props} project={project} saveProject={saveProject} />
}

export default connect(stateToProps, dispatchToProps)(ProjectSettingsGeneralContainer)
