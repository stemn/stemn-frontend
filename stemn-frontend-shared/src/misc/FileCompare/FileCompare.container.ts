import { connect } from 'react-redux'
import { IStoreState } from 'reducer'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { changeMode, initCompare, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { toggle } from 'stemn-shared/misc/TogglePanel/TogglePanel.actions'
import { FileCompareComponent } from './FileCompare'

export interface IFileCompareContainerProps {
  file: {
    data: IFile,
    revisions: any[],
  },
}

const stateToProps = ({ syncTimeline, fileCompare }: IStoreState, { file }: IFileCompareContainerProps) => {
  const syncTimelineCacheKey = `${file.data.fileId}`
  const togglePanelCacheKey = `${file.data.fileId}-${file.data.revisionId}`
  return {
    compare: fileCompare[syncTimelineCacheKey] || {},
    syncTimelineCacheKey,
    togglePanelCacheKey,
  }
}

export const dispatchToProps = {
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

const withFetchData = fetchDataHoc(fetchConfigs)(FileCompareComponent)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
