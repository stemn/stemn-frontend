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

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    const { localPath, fileId, fileMeta, revisionId, projectId } = nextProps;
    // If localPath exists - we must get the fileId - this will get the meta
    if(localPath){
      nextProps.filesActions.getMetaFromPath({path: localPath})
    }
    // If we do not yet have the meta, get it:
    else if(!fileMeta || !fileMeta.data && !fileMeta.loading){
      nextProps.filesActions.getMeta({projectId, fileId, revisionId});
    }
  },
  componentWillMount() { this.onMount(this.props) },

  render() {
    const { fileMeta } = this.props;
    return (
      <div className="layout-column flex">
        { fileMeta && fileMeta.data && fileMeta.data.data
          ? <PreviewPageInner fileMeta={fileMeta.data} />
          : null }
        <LoadingOverlay show={fileMeta && fileMeta.loading} />
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
