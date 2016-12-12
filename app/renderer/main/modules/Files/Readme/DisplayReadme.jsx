// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FilesActions from '../Files.actions.js';

// Component Core
import React, { PropTypes } from 'react';
import { omit } from 'lodash';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PreviewFile        from 'app/renderer/main/modules/Files/PreviewFile/PreviewFile.jsx';
import EditorDisplay from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  file         : PropTypes.object,
  fileData     : PropTypes.object,
  cacheKey     : PropTypes.string,
  filesActions : PropTypes.object,
};

export const DisplayReadme = React.createClass({
  propTypes: propTypesObject,
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the previewId changes, download a new file
    if(!prevProps || nextProps.cacheKey !== prevProps.cacheKey){
      // If we don't already have the file, get it
      if(!nextProps.fileData){
        nextProps.filesActions.getFile({
          projectId  : nextProps.file.project._id,
          fileId     : nextProps.file.fileId,
          revisionId : nextProps.file.revisionId,
          provider   : nextProps.file.provider
        })
      }
    }
  },
  render() {
    const { file, fileData } = this.props;
    return (
      <div { ...omit(this.props, Object.keys(propTypesObject)) }>
        { fileData && fileData.data
        ? <EditorDisplay value={fileData.data}/>
        : null }
        <LoadingOverlay show={!fileData || fileData && !fileData.data}/>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {project, file}) {
  const cacheKey = `${file.fileId}-${file.revisionId}`;
  return {
    cacheKey  : cacheKey,
    fileData  : files.fileData[cacheKey],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayReadme);
