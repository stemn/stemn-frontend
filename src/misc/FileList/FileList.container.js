import { connect } from 'react-redux'
import FileList from './FileList'
import { getFiles, getSearchResults } from './FileList.actions.js'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { get } from 'lodash'
import { bindActionCreators } from 'redux'

const stateToProps = ({ fileList }, { projectId, path, provider }) => {
  const fileListCacheKey = `${projectId}-${path}-${provider}`
  return {
    fileListCacheKey,
    fileList: get(fileList, fileListCacheKey, {}),
  }
}

const dispatchToProps = dispatch => ({
  getFiles: bindActionCreators(getFiles, dispatch),
  getSearchResults: bindActionCreators(getSearchResults, dispatch),
  dispatch,
})

const fetchConfigs = [{
  hasChanged: 'path',
  onChange: (props) => {
    props.getFiles({
      path: props.path,
      provider: props.options.explore,
      projectId: props.projectId,
      cacheKey: props.fileListCacheKey,
    })
  },
}, {
  hasChanged: 'fileList.query',
  onChange: (props) => {
    if (props.fileList.query && props.fileList.query.length > 0) {
      props.getSearchResults({
        folderId: props.path,
        query: props.fileList.query,
        projectId: props.projectId,
        cacheKey: props.fileListCacheKey,
      })
    }
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(FileList)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)
export default withRedux
