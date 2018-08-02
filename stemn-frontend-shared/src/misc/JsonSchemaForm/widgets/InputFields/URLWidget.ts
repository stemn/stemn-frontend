import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const URLWidget = (props: WidgetProps & FieldTemplateProps) => {
  const placeholder = 'https://www.stemn.com'
  return InputField(props, 'uri', placeholder)
}
