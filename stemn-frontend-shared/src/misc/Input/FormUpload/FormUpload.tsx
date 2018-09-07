import * as React from 'react'
import { WrappedFieldProps } from 'redux-form'

export interface IFormUploadProps extends WrappedFieldProps {
  className?: string,
  style?: object,
}

export class FormUpload extends React.Component<IFormUploadProps> {
  public render () {
    // const { input, className, style } = this.props
    return (
      <div>
        assfa
      </div>
    )
  }
}
