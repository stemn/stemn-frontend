import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push as pushRoute } from 'react-router-redux'
import { create } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { projectFolderRoute } from 'route-actions'
import { saveProject } from 'stemn-shared/misc/Projects/Projects.actions'
import ProjectFilesPage from './ProjectFilesPage'

const stateToProps = ({ projects, projectSettings, fileList }, { params, location, provider }) => {
  const projectId = params.stub
  const path = params.path || ''
  const project = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`
  const fileListCacheKey = `${projectId}-${path}-${provider}`
  const files = fileList[fileListCacheKey]

  return {
    project,
    entityModel,
    path,
    files,
  }
}

const dispatchToProps = {
  pushRoute,
  saveProject,
  create,
}

export default connect(stateToProps, dispatchToProps)(ProjectFilesPage)
