import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import classes from './Upload.css'
import dropzone from 'react-dropzone'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdFileUpload from 'react-icons/md/file-upload'

const Dropzone = dropzone.default

export default class Upload extends Component {
  static propTypes = {
    uploadId: PropTypes.string.isRequired, // The id of this uploader (used as cache key)
    style: PropTypes.object,               // Styles
    containerClassName: PropTypes.string,  // Classes for the container element
    imageClassName: PropTypes.string,      // Classes for the image element
    model: PropTypes.string,               // The model (optional)
    value: PropTypes.string,               // The initial value
    onUpload: PropTypes.func,              // Function to be run when the upload is complete
    // From container
    uploadData: PropTypes.object,
    upload: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }
  dropStyle = {
    minHeight: '50px',
  }

  dropActiveStyle = {
    outline: '4px solid #82c382',
  }

  onDrop = (files) => {
    const { upload, change, uploadId, onUpload, model } = this.props
    upload({
      files,
      cacheKey: uploadId,
    }).then((response) => {
      if (onUpload) {
        onUpload(response.value.data)
      }
      // If we have a model, update it
      if (model) {
        change(model, response.value.data.url)
      }
    })
  }

  renderOverlay = () => (
    <div className={ cn('layout-column layout-align-center-center', classes.overlay) }>
      <MdFileUpload size={ 30 } />
    </div>
  )

  render() {
    const {
      uploadData,
      style,
      containerClassName,
      imageClassName,
      value,
    } = this.props

    const imageClasses = cn(classes.image, imageClassName)

    return (
      <div style={ style } className={ containerClassName }>
        <Dropzone
          onDrop={ this.onDrop }
          activeStyle={ this.dropActiveStyle }
          disableClick={ false }
          multiple={ false }
        >
          <div className="layout-row layout-align-start-start">
            { uploadData && uploadData.files && uploadData.files.length > 0
              ? uploadData.files.map((file, index) => (
                <div
                  key={ index }
                  className={ imageClasses }
                  style={ { backgroundImage: `url(${file.path ? `https://stemn.com${file.path}` : file.preview})` } }
                >
                  { !uploadData.loading
                    ? this.renderOverlay()
                    : null }
                  <LoadingOverlay
                    progress={ uploadData.percentage }
                    show={ uploadData.loading }
                    size="sm"
                    background="rgba(255, 255, 255, 0.8)"
                  />
                </div>
              ))
              : <div
                className={ imageClasses }
                style={ value ? { backgroundImage: `url(https://stemn.com${value})` } : {} }
              >
                { this.renderOverlay() }
              </div>
            }
          </div>
        </Dropzone>
      </div>
    )
  }
}
