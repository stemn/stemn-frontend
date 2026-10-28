import { ObjectFieldTemplateProps } from '@rjsf/utils'
import * as React from 'react'

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  return (
    <div>
      {props.properties.map((element) => element.content)}
    </div>
  )
}
