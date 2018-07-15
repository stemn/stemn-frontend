import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { InputField } from './Input'

export const URLWidget = (props: WidgetProps & FieldTemplateProps) => {
  const placeholder = 'https://www.stemn.com';
  return InputField(props, "uri", placeholder)
};
