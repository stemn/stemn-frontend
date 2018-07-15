import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const InputField = (props: WidgetProps & FieldTemplateProps, type: string, placeholder?: string) => {
  return (
    <Input
      required={props.required}
      value={props.value}
      className="dr-input flex"
      type={ type }
      placeholder={placeholder || ''}
      onChange={(event : React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
    />
  );
};
