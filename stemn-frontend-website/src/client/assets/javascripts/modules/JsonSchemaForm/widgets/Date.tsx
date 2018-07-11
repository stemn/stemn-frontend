import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'

export const Date = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <DatePicker
      model={ props.value }
      onChange={(event : any) => props.onChange(event.target.value)}
      value={ props.value }
    />
  );
};
