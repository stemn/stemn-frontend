import { WidgetProps } from '@rjsf/utils'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const EmailWidget = (props: WidgetProps) => {
  return InputField(props, 'email', 'example@email.com')
}
