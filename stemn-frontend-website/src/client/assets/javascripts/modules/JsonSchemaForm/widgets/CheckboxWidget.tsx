

import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import Radio from 'stemn-shared/misc/Input/Radio/Radio'

export const CheckboxWidget = (props: WidgetProps & FieldTemplateProps) => {

  console.log('RADIO')

  return (
    <Radio
      model={ '' }
      value={ props.title }
      modelValue={ props.value }
    />
  );
};
