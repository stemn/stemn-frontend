// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';
import { has } from 'lodash';

// Actions
import * as FilesActions from 'stemn-frontend-shared/src/misc/Files/Files.actions.js';
import * as SyncTimelineActions from 'stemn-frontend-shared/src/misc/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
import LoadingOverlay   from 'stemn-frontend-shared/src/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PreviewPageInner from './PreviewPageInner.jsx'
import cloudMagnify    from 'stemn-frontend-shared/src/assets/images/pure-vectors/cloud-magnify.svg';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    const hasFileMeta    = has(nextProps, 'fileMeta.data') && !nextProps.fileMeta.loading;
    const string1        = prevProps ? prevProps.localPath + prevProps.projectId + prevProps.fileId + prevProps.revisionId : '';
    const string2        = nextProps ? nextProps.localPath + nextProps.projectId + nextProps.fileId + nextProps.revisionId : '';
    const hasChangedFile = string1 != string2;

    if(string1 != string2){
      // If localPath exists - we must get the fileId - this will get the meta
      if(nextProps.localPath){
        nextProps.filesActions.getMetaFromPath({
          path       : nextProps.localPath
        })
      }
      // If we do not yet have the meta, get it:
      else if(!hasFileMeta){
        nextProps.filesActions.getMeta({
          projectId  : nextProps.projectId,
          fileId     : nextProps.fileId,
          revisionId : nextProps.revisionId
        });
      }
    }
  },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillMount() { this.onMount(this.props) },
  render() {
    const { fileMeta } = this.props;
    const hasFileMeta  = fileMeta && !fileMeta.loading && !fileMeta.data;


    return (
      <div className="layout-column flex">
        { hasFileMeta ?
          <div className="flex layout-column layout-align-center-center text-center">
            <div style={{maxWidth: '300px'}}>
              <img src={cloudMagnify} style={{width: '100px', height: '100px'}}/>
              <div className="text-title-4" style={{marginBottom: '10px'}}>Could not locate this file</div>
              <div className="text-title-5" style={{marginBottom: '20px'}}>This file could not be found in your connected cloud providers.</div>
            </div>
          </div>
          : <PreviewPageInner fileMeta={fileMeta} />
        }
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
