
import * as React from 'react'
import { WidgetProps } from '@rjsf/utils'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'

export const TextareaWidget = (props: WidgetProps) => {

  return (
    <Textarea
      required={props.required}
      value={props.value}
      className='dr-input flex'
      type='text'
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value === '' ? props.options.emptyValue : event.target.value)}
    />
  )
}
