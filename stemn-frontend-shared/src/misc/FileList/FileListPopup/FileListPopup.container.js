import { connect } from 'react-redux'
import FileListPopup from './FileListPopup'
import { getFiles } from '../FileList.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'

const stateToProps = ({ fileList }, { projectId, path, provider }) => {
  const fileListCacheKey = `${projectId}-${path}-${provider}`
  return {
    fileListCacheKey,
    fileList: get(fileList, fileListCacheKey, {}),
  }
}

const dispatchToProps = {
  getFiles,
}

const fetchConfigs = [{
  hasChanged: 'isOpen',
  onChange: (props) => {
    if (props.isOpen) {
      props.getFiles({
        path: props.path,
        //        provider: props.provider,
        projectId: props.projectId,
        cacheKey: props.fileListCacheKey,
      })
    }
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(FileListPopup)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
