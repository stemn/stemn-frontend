import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const URLWidget = (props: WidgetProps & FieldTemplateProps) => {

  const initial = 'https://';

  return (
    <Input
      required={props.required}
      value={props.value || initial}
      className="dr-input flex"
      type="uri"
      onChange={(event : any) => props.onChange(event.target.value)}
    />
  );
};
