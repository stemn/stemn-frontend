import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { orderByTime } from 'stemn-shared/misc/Timeline/Timeline.utils'
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils'

import cn from 'classnames'
import classes from './DownloadModal.css'

import Button from 'stemn-shared/misc/Buttons/Button/Button'
import DownloadFile from '../../DownloadFile/DownloadFile.jsx'
import Label from 'stemn-shared/misc/Label/Label.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

const propTypesObject = {
//  revisions: PropTypes.array,                // Standard array of revisions
  file: PropTypes.object.isRequired,    // File object
}

export default class DownloadModal extends React.Component {
  static propTypes = propTypesObject;

  componentWillMount() { 
    const { file, fetchTimeline } = this.props
    if (file.project && file.project._id) {
      // If this is a sync file
      fetchTimeline({
        entityType: 'file',
        entityId: file.fileId,
        cacheKey: file.fileId,
      })
    } else {
      // If this is remote file
      fetchTimeline({
        entityType: 'file',
        entityId: file.fileId,
        provider: file.provider,
        cacheKey: file.fileId,
      })
    }
  }

  render() {
    const {
      syncTimeline,
      modalCancel,
    } = this.props

    const allRevisions = syncTimeline && syncTimeline.data 
      ? orderByTime(getRevisions(syncTimeline.data)) 
      : []
    
    return (
      <div className={ `${classes.modal} layout-column` }>
        <div className="modal-title">Download previous versions</div>
        <div className={ `${classes.ribbon} text-grey-3` }>
          You can download any previous version of this file. Take care when overwriting the latest version.
        </div>
        <div className="modal-body flex scroll-box rel-box" style={ { padding: '0' } }>
          <LoadingOverlay show={ syncTimeline && syncTimeline.loading } linear hideBg />
          {allRevisions.map((revision, index) => (
            <div className={ cn(classes.row, 'layout-row layout-align-start-center') } key={ revision._id }>
              <div style={ { width: '70px' } }>Version {revision.data.revisionNumber}</div>
              <div className="flex text-grey-3">{revision.timestamp ? moment(revision.timestamp).fromNow() : null}</div>
              {index === 0 ? <Label style={ { marginRight: '10px' } }>Latest Version</Label> : null}
              <DownloadFile file={ revision.data }>Download</DownloadFile>
            </div>
          ))}
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex" />
          <Button className="primary" onClick={ modalCancel }>Close</Button>
        </div>
      </div>
    )
  }
}
