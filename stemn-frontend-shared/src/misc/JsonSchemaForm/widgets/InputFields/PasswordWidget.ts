import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const PasswordWidget = (props: WidgetProps & FieldTemplateProps) => {
  return InputField(props, 'password')
}
