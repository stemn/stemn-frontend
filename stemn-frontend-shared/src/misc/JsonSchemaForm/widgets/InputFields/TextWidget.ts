import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { InputField } from './Input'

export const TextWidget = (props: WidgetProps & FieldTemplateProps) => {
  return InputField(props, "text")
};
