import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { getLabelText } from '../utils'

export const ObjectFieldTemplate = (props : ObjectFieldTemplateProps) => {

  const { title, description, properties } = props;

  return (
    <div>
      { !description && !title ? null : (
        <div>
          <h4>{ getLabelText(title, false) }</h4>
          <p> { description } </p>
        </div>
      )}

      <div>
        {properties.map((element) => element.content)}
      </div>

    </div>
  );
}
