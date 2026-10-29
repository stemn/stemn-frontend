import { WidgetProps } from '@rjsf/utils'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const PasswordWidget = (props: WidgetProps) => {
  return InputField(props, 'password')
}
