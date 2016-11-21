// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';

// Actions
import * as FilesActions from 'app/renderer/main/modules/Files/Files.actions.js';
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
import LoadingOverlay   from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PreviewPageInner from './PreviewPageInner.jsx'
// Styles
import classes from './PagePreview.css';

import modelLocked    from 'app/renderer/assets/images/pure-vectors/model-locked.svg';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    const { localPath, fileId, fileMeta, revisionId } = nextProps;
    // If localPath exists - we must get the fileId
    if(localPath){
      nextProps.filesActions.getMetaFromPath({path: localPath})
    }
    // If we do not yet have the meta, get it:
    else if(!fileMeta || !fileMeta.data && !fileMeta.loading){
      nextProps.filesActions.getMeta({fileId, revisionId});
    }
  },
  componentWillMount() { this.onMount(this.props) },

  render() {
    const { fileMeta } = this.props;
    console.log(fileMeta);
    return (
      <div className="layout-column flex">
        { fileMeta && fileMeta.data && fileMeta.data.project && fileMeta.data.project._id
          ? <PreviewPageInner fileMeta={fileMeta.data}/>
          : null }
        { fileMeta && fileMeta.data && fileMeta.data.project && !fileMeta.data.project._id
          ? <div className="layout-column layout-align-center-center flex text-center">
              <img style={{width: '100px'}} src={modelLocked}/>
              <div className="text-title-4" style={{marginBottom: '10px'}}>This file is not in a Stemn Project</div>
              <div className="text-title-5">Files must be part of a Stemn project in order to be viewed.</div>
            </div>
          : null }
        <LoadingOverlay show={!fileMeta}/>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ files }, { location }) {
  let { localPath, revisionId, fileId, projectId } = location.query;
  fileId = fileId || (files.pathToId[localPath] ? files.pathToId[localPath].data : '');
  const cacheKey = localPath ? fileId : `${fileId}-${revisionId}`;

  return {
    localPath,
    fileId,
    revisionId,
    projectId,
    fileMeta: files.fileMeta[cacheKey],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
