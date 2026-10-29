import React, { Component } from 'react'
import cn from 'classnames'
import classes from './Upload.module.css'
import Dropzone from 'react-dropzone'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { MdFileUpload } from 'react-icons/md'

export default class Upload extends Component {
  dropActiveStyle = {
    outline: '4px solid #82c382',
  }

  onDrop = (acceptedFiles) => {
    const { upload, change, uploadId, onUpload, model } = this.props
    // react-dropzone >= 7 no longer adds `file.preview` - create it ourselves
    // (not revoked: the preview url is kept in the upload store and shown after upload)
    const files = acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
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
    <div className={cn('layout-column layout-align-center-center', classes.overlay)}>
      <MdFileUpload size={30} />
    </div>
  )

  render() {
    const { uploadData, style, containerClassName, imageClassName, value } = this.props

    const imageClasses = cn(classes.image, imageClassName)

    return (
      <div style={style} className={containerClassName}>
        <Dropzone onDrop={this.onDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps({ style: isDragActive ? this.dropActiveStyle : undefined })}>
              <input {...getInputProps()} />
              <div className="layout-row layout-align-start-start">
                {uploadData && uploadData.files && uploadData.files.length > 0 ? (
                  uploadData.files.map((file, index) => (
                    <div
                      key={index}
                      className={imageClasses}
                      style={{
                        backgroundImage: `url(${file.path ? `${GLOBAL_ENV.API_SERVER}${file.path}` : file.preview})`,
                      }}
                    >
                      {!uploadData.loading ? this.renderOverlay() : null}
                      <LoadingOverlay
                        progress={uploadData.percentage}
                        show={uploadData.loading}
                        size="sm"
                        background="rgba(255, 255, 255, 0.8)"
                      />
                    </div>
                  ))
                ) : (
                  <div
                    className={imageClasses}
                    style={value ? { backgroundImage: `url(${GLOBAL_ENV.API_SERVER}${value})` } : {}}
                  >
                    {this.renderOverlay()}
                  </div>
                )}
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    )
  }
}
