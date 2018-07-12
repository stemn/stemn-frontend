import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { getLabelText } from '../utils'

export const ObjectFieldTemplate = (props : ObjectFieldTemplateProps) => {

  const { properties } = props;

  return (
    <div>
      {properties.map((element) => element.content)}
    </div>

  );
}
