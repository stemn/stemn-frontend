import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { bindActionCreators } from 'redux'
import { push as pushRoute } from 'react-router-redux'
import { saveProject } from 'stemn-shared/misc/Projects/Projects.actions'
import ProjectOverview from './ProjectOverview'
import { getCanEdit } from 'stemn-shared/misc/Auth/Auth.utils'
import { get } from 'lodash'
import { getCount } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'

const stateToProps = ({ projects, projectSettings, fileList, auth, syncTimeline }, { params, location, provider }) => {
  const projectId = params.stub
  const path = params.path || ''
  const project = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`
  const fileListCacheKey = `${projectId}-${path}-${provider}`
  const files = fileList[fileListCacheKey]
  const canEdit = getCanEdit(auth.user, get(project, 'data.owner'), get(project, 'data.team'), 'admin')
  const changesCountCacheKey = `changes-count-${projectId}`

  return {
    changesCount: get(syncTimeline, [changesCountCacheKey, 'data']),
    changesCountCacheKey,
    projectId,
    project,
    entityModel,
    path,
    files,
    isFilePage: location.pathname.includes('/files/'),
    canEdit,
  }
}

const dispatchToProps = {
  pushRoute,
  saveProject,
  getCount,
}

const fetchConfigs = [{
  hasChanged: 'changesCountCacheKey',
  onChange: (props) => {
    props.getCount({
      entityType: 'project',
      entityId: props.projectId,
      types: ['changes'],
      cacheKey: props.changesCountCacheKey,
    })
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class LoginContainer extends Component {
  render() {
    return (
      <ProjectOverview { ...this.props } />
    )
  }
}
