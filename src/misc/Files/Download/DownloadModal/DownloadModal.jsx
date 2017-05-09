import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { registerModal } from 'stemn-shared/misc/Modal/ModalRegistry'
import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';
import { actions } from 'react-redux-form';
import React, { PropTypes } from 'react';
import moment from 'moment';
import { orderBy } from 'lodash';
import classNames from 'classnames';
import classes from './DownloadModal.css'
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import MdDone from 'react-icons/md/done';
import DownloadFile from '../../DownloadFile/DownloadFile.jsx'
import Label        from 'stemn-shared/misc/Label/Label.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

const propTypesObject = {
  revisions   : PropTypes.array,                // Standard array of revisions
  file        : PropTypes.object.isRequired,    // File object
}

export const DownloadModal = React.createClass({
  propTypes: propTypesObject,
  onMount(nextProps, prevProps){
    // If this is a sync file
    if(nextProps.file.project && nextProps.file.project._id){
      nextProps.syncTimelineActions.fetchTimeline({
        entityType : 'file',
        entityId   : nextProps.file.fileId,
      })
    }
    // If this is remote file
    else {
      nextProps.syncTimelineActions.fetchTimeline({
        entityType : 'file',
        entityId   : nextProps.file.fileId,
        provider   : nextProps.file.provider,
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  render() {
    const { modalCancel, modalConfirm } = this.props;
    const { revisions, syncTimeline } = this.props;

    const orderByTime = (items) => orderBy(items, item => (new Date(item.timestamp)).getTime(), 'desc');
    const filterByRevision = (items) => items.filter(item => item.event == 'revision');

    const allRevisions = syncTimeline && syncTimeline.data ? orderByTime(filterByRevision(syncTimeline.data)) : [];
    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">Download previous versions</div>
        <div className={classes.ribbon + ' text-grey-3'}>
          You can download any previous version of this file. Take care when overwriting the latest version.
        </div>
        <div className="modal-body flex scroll-box rel-box" style={{padding: '0'}}>
          <LoadingOverlay show={syncTimeline && syncTimeline.loading} linear={true} hideBg={true}/>
          {allRevisions.map((revision, index) => (
            <div className={classNames(classes.row, 'layout-row layout-align-start-center')} key={revision._id}>
              <div style={{width: '70px'}}>Version {revision.data.revisionNumber}</div>
              <div className="flex text-grey-3">{revision.timestamp ? moment(revision.timestamp).fromNow() : null}</div>
              {index == 0 ? <Label style={{marginRight: '10px'}}>Latest Version</Label> : null}
              <DownloadFile file={ revision.data }>Download</DownloadFile>
            </div>
          ))}
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex"></div>
          <Button className="primary" onClick={ modalCancel }>Close</Button>
        </div>
      </div>
    );
  }
})

function stateToProps({syncTimeline}, {file}) {
  return {
    syncTimeline: syncTimeline[file.fileId],
  };
}

function dispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    dispatch
  }
}

const modalName = 'FILE_DOWNLOAD'
const ModalComponent = connect(stateToProps, dispatchToProps)(DownloadModal)
registerModal(modalName, ModalComponent)
export default modalName
