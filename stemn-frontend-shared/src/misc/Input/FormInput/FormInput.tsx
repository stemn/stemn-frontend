import * as React from 'react'
import { WrappedFieldProps } from 'redux-form'

export interface IFormInputProps extends WrappedFieldProps {
  className?: string,
  placeholder?: string,
  style?: object,
  type?: string,
}

export class FormInput extends React.Component<IFormInputProps> {
  public render () {
    const { input, className, placeholder, style, type } = this.props
    return (
      <input
        {...input}
        className={className}
        placeholder={placeholder}
        style={style}
        type={type}
      />
    )
  }
}
