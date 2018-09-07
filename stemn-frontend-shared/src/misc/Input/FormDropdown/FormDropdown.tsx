import * as React from 'react'
import { WrappedFieldProps } from 'redux-form'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export interface IFormDropdownProps extends WrappedFieldProps {
  className?: string,
  style?: object,
  placeholder?: string,
  options?: Array<{
    name: string,
    value: string,
  }>
}

// className?: string,
// placeholder?: string,
// style?: object,
// type?: string,

export class FormDropdown extends React.Component<IFormDropdownProps> {
  public render () {
    const { input, className, placeholder, style, options = [] } = this.props
    console.log(this.props)
    return (
      <PopoverDropdown
        {...input}
        onChange={(item: any) => input.onChange(item.value)}
        className={className}
        placeholder={placeholder}
        style={style}
        options={options}
      />
    )
  }
}
