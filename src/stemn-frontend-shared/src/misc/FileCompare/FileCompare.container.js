import { connect } from 'react-redux'
import FileCompare from './FileCompare'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { toggle } from 'stemn-shared/misc/TogglePanel/TogglePanel.actions'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'


const stateToProps = ({ syncTimeline, fileCompare }, { file }) => {
  const syncTimelineCacheKey = `${file.data.fileId}`
  const togglePanelCacheKey = `${file.data.fileId}-${file.data.revisionId}`
  return {
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
