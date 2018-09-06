import { get } from 'lodash'
import { connect } from 'react-redux'
import { push as pushRoute } from 'react-router-redux'
import { compose } from 'redux'
import { show as showWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { default as fetchDataHoc } from 'stemn-shared/misc/FetchDataHoc'
import { changeMode, initCompare, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { getMeta, getMetaFromPath } from 'stemn-shared/misc/Files/Files.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { PreviewPage } from './PreviewPage'

const stateToProps = ({ files, fileCompare, syncTimeline }, { location }) => {
  const { localPath, revisionId, fileId, projectId } = location.query
  const cacheKeyWithLocal = `${localPath}-${fileId}-${revisionId}`
  // We use the standard cacheKey also so the data
  // is accesible in place where we don't use localPath
  const cacheKey = `${fileId}-${revisionId}`

  return {
    localPath,
    cacheKey,
    cacheKeyWithLocal,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKeyWithLocal] || {},
    projectId,
    revisonId: revisionId || '',
    timeline: get(syncTimeline, cacheKey, {}),
  }
}

const dispatchToProps = {
  changeMode,
  fetchTimeline,
  getMeta,
  initCompare,
  pushRoute,
  select,
  showWindow,
  getMetaFromPath,
}

const fetchConfigs = [{
  hasChanged: 'cacheKeyWithLocal',
  onChange: (props) => {
    // If we have localPath, we use that to look up fileId, projectId etc
    if (props.localPath) {
      props.getMetaFromPath({
        path: props.localPath,
        cacheKey: props.cacheKeyWithLocal,
      })
    } else {
      props.getMeta({
        fileId: props.fileId,
        revisionId: props.revisionId,
        projectId: props.projectId,
        cacheKey: props.cacheKeyWithLocal,
      })
    }
  },
}, {
  hasChanged: 'file.data.fileId',
  onChange: (props) => {
    if (get(props, 'file.data.fileId')) {
      props.fetchTimeline({
        entityType: 'file',
        entityId: props.file.data.fileId,
        cacheKey: props.cacheKey,
      })
      props.initCompare({
        cacheKey: props.cacheKey,
        file: props.file,
      })
    }
  },
}]

// export const PreviewPageContainer = connect(stateToProps, dispatchToProps)(PreviewPage)
export const PreviewPageContainer = compose(
  connect(stateToProps, dispatchToProps),
  fetchDataHoc(fetchConfigs),
)(PreviewPage)
