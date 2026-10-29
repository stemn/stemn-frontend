import { WidgetProps } from '@rjsf/utils'
import { InputField } from 'stemn-shared/misc/JsonSchemaForm/widgets/InputFields/Input'

export const URLWidget = (props: WidgetProps) => {
  const placeholder = 'https://www.stemn.com'
  return InputField(props, 'uri', placeholder)
}
