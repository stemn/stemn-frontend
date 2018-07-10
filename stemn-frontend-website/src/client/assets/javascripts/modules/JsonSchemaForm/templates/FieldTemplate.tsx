import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';

export const FieldTemplate = (props : FieldTemplateProps) => {
  const { id, classNames, label, required, description, children } = props;

  console.log({ label, description })

  return (
    <div className={classNames}>

      { /* Handle Required field titles */}
      <label htmlFor={id}>{label}{required ? "*" : null}</label>

      {/* {description} */}
      {children}

    </div>
  );
}
