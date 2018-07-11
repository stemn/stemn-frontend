
import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'

export const TextAreaWidget = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <Textarea
      model={ props.value }
      value={ props.value }
      className="text-title-4 input-plain flex"
      autoFocus
    />
  );
};
