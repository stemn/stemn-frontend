import * as React from 'react'
import { ObjectFieldTemplateProps } from 'react-jsonschema-form'

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  return (
    <div>
      {props.properties.map((element) => element.content)}
    </div>
  )
}
