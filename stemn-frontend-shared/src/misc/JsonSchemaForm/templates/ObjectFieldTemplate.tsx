import { ObjectFieldTemplateProps } from '@rjsf/utils'

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  return (
    <div>
      {props.properties.map((element) => element.content)}
    </div>
  )
}
