import React from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { push as pushRoute } from 'stemn-shared/routing'
import { useSaveProject } from 'stemn-shared/api/queries/projects'
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
  getCount,
}

const fetchConfigs = [
  {
    hasChanged: 'changesCountCacheKey',
    onChange: (props) => {
      props.getCount({
        entityType: 'project',
        entityId: props.projectId,
        types: ['changes'],
        cacheKey: props.changesCountCacheKey,
      })
    },
  },
]

/** The readme is edited in `projects.data[id]` (Redux); saving is the projects update mutation */
const ProjectOverviewContainer = (props) => {
  const { saveProject } = useSaveProject()
  return <ProjectOverview {...props} saveProject={saveProject} />
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(ProjectOverviewContainer))
