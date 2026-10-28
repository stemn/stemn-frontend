import { WidgetProps } from '@rjsf/utils'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const TextWidget = (props: WidgetProps) => {
  return InputField(props, 'text')
}
