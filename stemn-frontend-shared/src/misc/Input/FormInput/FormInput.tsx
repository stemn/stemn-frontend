import * as React from 'react'
import { IFieldProps } from '../FormField'

export interface IFormInputProps extends IFieldProps {
  className?: string
  placeholder?: string
  style?: object
  type?: string
}

export class FormInput extends React.Component<IFormInputProps> {
  public render() {
    const { input, className, placeholder, style, type } = this.props
    return <input {...input} className={className} placeholder={placeholder} style={style} type={type} />
  }
}
