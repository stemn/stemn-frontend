import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const Password = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <div>
      <Input
        model={ `` }
        value={ '' }
        className="dr-input flex"
        type="password"
        placeholder={ '' }
      />
      <p> hello </p>
    </div>
  );
};
