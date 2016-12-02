// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';
import { actions } from 'react-redux-form';

// Component Core
import React, { PropTypes } from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './DownloadModal.css'

// Sub Components
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import MdDone from 'react-icons/md/done';
import DownloadFile from '../../DownloadFile/DownloadFile.jsx'
import Label        from 'app/shared/modules/Label/Label.jsx'
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  revisions   : PropTypes.array,                // Standard array of revisions
  file        : PropTypes.object.isRequired,    // File object
};

export const FileSelectModal = React.createClass({
  propTypes: propTypesObject,
  onMount(nextProps, prevProps){
    // If this is a sync file
    if(nextProps.file.project && nextProps.file.project._id){
      nextProps.syncTimelineActions.fetchTimeline({
        projectId : nextProps.file.project._id,
        fileId    : nextProps.file.fileId,
      })
    }
    // If this is remote file
    else{
      nextProps.syncTimelineActions.fetchTimeline({
        fileId    : nextProps.file.fileId,
        provider  : nextProps.file.provider,
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  render() {
    const { modalCancel, modalHide, modalConfirm } = this.props;
    const { revisions, syncTimeline } = this.props;

    const allRevisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];
    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">Download previous version</div>
        <div className={classes.ribbon + ' text-grey-3'}>
          You can download any previous version of this file. Take care when overwriting the latest version.
        </div>
        <div className="modal-body flex scroll-box rel-box" style={{padding: '0'}}>
          <LoadingOverlay show={syncTimeline && syncTimeline.loading} linear={true} hideBg={true}/>
          {allRevisions.map((revision, index) => (
            <div className={classNames(classes.row, 'layout-row layout-align-start-center')} key={revision._id}>
              <div style={{width: '70px'}}>Version 1</div>
              <div className="flex text-grey-3">{revision.timestamp ? moment(revision.timestamp).fromNow() : null}</div>
              {index == allRevisions.length -1 ? <Label style={{marginRight: '10px'}}>Latest Version</Label> : null}
              <DownloadFile file={revision.data}>Download</DownloadFile>
            </div>
          ))}
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex"></div>
          <Button className="primary" onClick={modalHide}>Close</Button>
        </div>
      </div>
    );
  }
});



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({syncTimeline}, {file}) {
  return {
    syncTimeline: syncTimeline[file.fileId],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectModal);
