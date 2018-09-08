import * as cn from 'classnames'
import { cloneDeep } from 'lodash'
import * as React from 'react'
import Dropzone, { ImageFile } from 'react-dropzone'
import { WrappedFieldMetaProps } from 'redux-form'
import * as s from './FormUpload.scss'
// import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
// import Upload from 'stemn-shared/misc/Upload/Upload'

export interface IFormUploadProps {
  className?: string,
  style?: object,
  input: {
    checked?: boolean,
    value?: any,
    onBlur?: any,
    onChange: (files: ImageFile[]) => void,
  }
  meta?: WrappedFieldMetaProps
}

export class FormUpload extends React.Component<IFormUploadProps> {
  public onDrop = (acceptedFiles: ImageFile[]) => {
    const { input: { onChange } } = this.props
    const clonedAcceptedFiles = cloneDeep(acceptedFiles)
    onChange(clonedAcceptedFiles)
  }
  public render () {
    const { className, style } = this.props
    return (
      <div>
        <Dropzone
          className={cn(s.dropzone, 'layout-column', 'layout-align-center-center', className)}
          onDrop={this.onDrop}
          activeClassName={s.active}
          disableClick={false}
          multiple={true}
          style={style}
        >
          Drop files here to upload
        </Dropzone>
      </div>
    )
  }
}
