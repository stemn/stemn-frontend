import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const Email = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <Input
      model={ `` }
      value={ '' }
      className="dr-input flex"
      type="email"
      placeholder={ props.description || 'example@email.com' }
    />
  );
};
