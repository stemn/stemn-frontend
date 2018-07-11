import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const Text = (props: WidgetProps & FieldTemplateProps) => {
  console.log({ props })
  return (
    <Input
      model={ `` }
      value={ '' }
      className="dr-input flex"
      type="text"
      placeholder={ props.description || '...' }
    />
  );
};
