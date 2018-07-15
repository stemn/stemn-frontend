

import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form'
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox'

export const CheckboxWidget = (props: WidgetProps & FieldTemplateProps) => {

  const { schema, value } = props

  return (
    <div style={{ margin: '10px' }}>
      <Checkbox
        title={ 'Default title' }
        value={ value || false }
        onChange={() => {
          const newValue = !props.value
          props.onChange(newValue)
        }}
      />
      <span> { schema.description || schema.title } </span>
    </div>
  );
};
