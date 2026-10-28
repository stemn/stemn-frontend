import cn from 'classnames'
import { cloneDeep } from 'lodash'
import * as React from 'react'
import Dropzone from 'react-dropzone'
import { WrappedFieldMetaProps } from 'redux-form'
import s from './FormUpload.scss'
// import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
// import Upload from 'stemn-shared/misc/Upload/Upload'

export interface IFormUploadProps {
  className?: string,
  style?: object,
  input: {
    checked?: boolean,
    value?: any,
    onBlur?: any,
    onChange: (files: File[]) => void,
  }
  meta?: WrappedFieldMetaProps
}

export class FormUpload extends React.Component<IFormUploadProps> {
  public onDrop = (acceptedFiles: File[]) => {
    const { input: { onChange } } = this.props
    const clonedAcceptedFiles = cloneDeep(acceptedFiles)
    onChange(clonedAcceptedFiles)
  }
  public render () {
    const { className, style } = this.props
    return (
      <div>
        <Dropzone
          onDrop={this.onDrop}
          multiple={true}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps({
                className: cn(s.dropzone, 'layout-column', 'layout-align-center-center', { [s.active]: isDragActive }, className),
                style,
              })}
            >
              <input {...getInputProps()} />
              Drop files here to upload
            </div>
          )}
        </Dropzone>
      </div>
    )
  }
}
