import { get } from 'lodash'
import { connect } from 'react-redux'
import { push as pushRoute } from 'react-router-redux'
import { compose } from 'redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { changeMode, initCompare, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { getMeta } from 'stemn-shared/misc/Files/Files.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { FileComponent } from './File'

const stateToProps = ({ files, fileCompare, syncTimeline }, { params, location }) => {
  const { projectId, fileId } = params
  const revisionId = location.query.revision
  const cacheKey = `${fileId}-${revisionId}`
  return {
    cacheKey,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
    timeline: get(syncTimeline, cacheKey, {}),
  }
}

export const dispatchToProps = {
  changeMode,
  fetchTimeline,
  getMeta,
  initCompare,
  pushRoute,
  select,
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.getMeta({
      fileId: props.fileId,
      revisionId: props.revisionId,
      projectId: props.projectId,
      cacheKey: props.cacheKey,
    })
    props.fetchTimeline({
      entityType: 'file',
      types: ['commits', 'changes'],
      entityId: props.fileId,
      cacheKey: props.cacheKey,
    })
  },
}, {
  hasChanged: 'file.data.fileId',
  onChange: (props) => {
    if (get(props, 'file.data.fileId')) {
      props.initCompare({
        cacheKey: props.cacheKey,
        file: props.file,
      })
    }
  },
}]
export default compose(
  connect(stateToProps, dispatchToProps),
  fetchDataHoc(fetchConfigs),
)(FileComponent)
