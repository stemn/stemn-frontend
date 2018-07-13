
import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'

export const TextareaWidget = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <Textarea
      required={props.required}
      value={props.value}
      className="dr-input flex"
      type="text"
      onChange={(event : any) => props.onChange(event.target.value)}
    />
  );
};
