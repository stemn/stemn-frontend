import React from 'react'
import { connect } from 'react-redux'

import ProjectSettingsTags from './ProjectSettingsTags'
import { removeField, addField } from 'stemn-shared/misc/Projects/Projects.actions'
import { useSaveProject } from 'stemn-shared/api/queries/projects'

const stateToProps = ({ projects }, { params }) => {
  const projectId = params.stub
  const project = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`

  return {
    project,
    entityModel,
  }
}

const dispatchToProps = {
  removeField,
  addField,
}

/** The tags are edited in `projects.data[id]` (Redux); saving is the projects update mutation */
const ProjectSettingsTagsContainer = (props) => {
  const { saveProject, savePending } = useSaveProject()
  const project = props.project && { ...props.project, savePending }
  return <ProjectSettingsTags {...props} project={project} saveProject={saveProject} />
}

export default connect(stateToProps, dispatchToProps)(ProjectSettingsTagsContainer)
