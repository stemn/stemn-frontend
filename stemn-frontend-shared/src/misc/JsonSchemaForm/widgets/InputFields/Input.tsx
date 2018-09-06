import * as React from 'react'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'
import Input from 'stemn-shared/misc/Input/Input/Input'

export const InputField = (props: WidgetProps & FieldTemplateProps, type: string, placeholder?: string) => {
  return (
    <Input
      required={props.required}
      value={props.value}
      className='dr-input flex'
      type={type}
      placeholder={placeholder || ''}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
    />
  )
}
