import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as FilesActions from '../Files.actions.js'
import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'

// /////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  file: PropTypes.object,
  fileData: PropTypes.object,
  cacheKey: PropTypes.string,
  filesActions: PropTypes.object,
}

export class DisplayReadme extends React.Component {
  static propTypes = propTypesObject;
  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  onMount = (nextProps, prevProps) => {
    // If the previewId changes, download a new file
    if (!prevProps || nextProps.cacheKey !== prevProps.cacheKey) {
      // If we don't already have the file, get it
      if (!nextProps.fileData) {
        nextProps.filesActions.getFile({
          projectId: nextProps.file.project._id,
          fileId: nextProps.file.fileId,
          revisionId: nextProps.file.revisionId,
          provider: nextProps.file.provider,
        })
      }
    }
  };

  render() {
    const {
      fileData,
    } = this.props
    if (fileData && fileData.loading || fileData && fileData.data) {
      return (
        <div { ...omit(this.props, Object.keys(propTypesObject)) }>
          { fileData && fileData.data
            ? <EditorDisplay value={ fileData.data } />
            : null }
          <LoadingOverlay show={ fileData && fileData.loading } size="sm" />
        </div>
      )
    }
    
    return <div>This file is empty.</div>
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ files }, { project, file }) {
  const cacheKey = `${file.fileId}-${file.revisionId}`
  return {
    cacheKey,
    fileData: files.fileData[cacheKey],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayReadme)
