import * as React from 'react'
import { WidgetProps } from '@rjsf/utils'
import Input from 'stemn-shared/misc/Input/Input/Input'

export const InputField = (props: WidgetProps, type: string, placeholder?: string) => {
  return (
    <Input
      required={props.required}
      value={props.value}
      className="dr-input flex"
      type={type}
      placeholder={placeholder || ''}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        props.onChange(event.target.value === '' ? props.options.emptyValue : event.target.value)
      }
    />
  )
}
