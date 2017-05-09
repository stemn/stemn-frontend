import { connect } from 'react-redux'
import FileCompare from './FileCompare'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { bindActionCreators } from 'redux'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { websocketJoinFile, websocketLeaveFile } from 'stemn-shared/misc/Files/actions'
import { toggle } from 'stemn-shared/misc/TogglePanel/TogglePanel.actions'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'


const stateToProps = ({ syncTimeline, fileCompare }, { file }) => {
  const syncTimelineCacheKey = `${file.data.fileId}`
  const togglePanelCacheKey = `${file.data.fileId}-${file.data.revisionId}`
  return {
//    timeline: syncTimeline[syncTimelineCacheKey],
    compare: get(fileCompare, syncTimelineCacheKey, {}),
    syncTimelineCacheKey,
    togglePanelCacheKey,
  }
}

const dispatchToProps = {
  fetchTimeline,
  toggle,
  initCompare,
  changeMode,
  select,
}

const fetchConfigs = [{
  hasChanged: 'syncTimelineCacheKey',
  onChange: (props) => {
//    props.fetchTimeline({
//      entityType: 'file',
//      entityId: props.file.data.fileId,
//      cacheKey: props.syncTimelineCacheKey,
//    })
    props.initCompare({
      cacheKey: props.syncTimelineCacheKey,
      file: props.file,
    })
  },
}, {
  hasChanged: 'togglePanelCacheKey',
  onChange: (props) => {
    if (props.isOpen) {
      props.toggle({
        cacheKey: props.togglePanelCacheKey,
        value: true,
      })
    }
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(FileCompare)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux


//    // Join the File room
//    nextProps.dispatch(websocketJoinFile({
//      fileId: nextProps.file.data.fileId
//    }))
//    // Join the File room
//    this.props.dispatch(websocketLeaveFile({
//      fileId: this.props.file.data.fileId
//    }))
