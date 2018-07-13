

import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'

export const CheckboxWidget = (props: WidgetProps & FieldTemplateProps) => {

  const value = !!props.value;

  return (
    <div style={{ borderBottom: '1px solid black', }}>
      <Checkbox
        required={props.required}
        value={ value }
        title={ value ? 'Deselect change' : 'Select change' }
        onChange={(event : React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
      />
    </div>
  );
};
