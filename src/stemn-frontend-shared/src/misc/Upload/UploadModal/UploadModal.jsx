import React, { Component } from 'react'
import classes from './UploadModal.css'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Upload from 'stemn-shared/misc/Upload/Upload'

const uploadId = 'UploadModal'

export default class UploadModal extends Component {
  onUpload = (response) => {
    this.props.modalConfirm(response)
    this.props.reset({ cacheKey: uploadId })
  }
  render() {
    const {
      modalCancel,
    } = this.props
    return (
      <div style={ { width: '600px' } }>
        <div className="modal-title">Upload a file</div>
        <div className="modal-body">
          <Upload
            containerClassName={ classes.container }
            imageClassName={ classes.image }
            uploadId={ uploadId }
            onUpload={ this.onUpload }
          />
        </div>
        <div className="modal-footer layout-row layout-align-end">
          <Button className="primary" onClick={ modalCancel }>Cancel</Button>
        </div>
      </div>
    )
  }
}
