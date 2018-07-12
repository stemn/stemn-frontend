import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'

export const DateWidget = (props: WidgetProps & FieldTemplateProps) => {

  return (
    <DatePicker
      onChange={(event : any) => props.onChange(event.target.value)}
      value={ props.value }
    />
  );
};
