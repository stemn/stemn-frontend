
import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'

export const TextareaWidget = (props: WidgetProps & FieldTemplateProps) => {

  console.log('asdcasdcasdcasdcasdcasdcasdcasdcasdcasdcasdcasdcasdcasdcasdc')

  return (
    <Textarea
      value={ props.value }
      className="dr-input flex"
      onChange={(event : any) => props.onChange(event.target.value)}
    />
  );
};
