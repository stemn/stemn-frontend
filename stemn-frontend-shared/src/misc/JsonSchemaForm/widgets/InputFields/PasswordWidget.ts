import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { InputField } from './Input'

export const PasswordWidget = (props: WidgetProps & FieldTemplateProps) => {
  return InputField(props, "password")
};
