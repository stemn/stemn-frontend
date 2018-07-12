import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'

export interface ISelectWidgetOptions {
  enumOptions: Array<{
    label: string;
    value: any;
  }>;
}

export const SelectWidget = (props: WidgetProps & FieldTemplateProps) => {

  const propOptions = props.options as ISelectWidgetOptions;
  const options = propOptions.enumOptions.map((option: any) => ({
    name: option.label,
    value: option.value
  }));

  return (
    <PopoverDropdown
      value={ props.value }
      options={ options }
      className="input"
      style={ { width: '100%' } }
      onChange={(option : any) => props.onChange(option.value)}
    />
  );
};
