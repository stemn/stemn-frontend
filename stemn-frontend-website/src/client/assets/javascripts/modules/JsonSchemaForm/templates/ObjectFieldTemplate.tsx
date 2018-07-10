import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';

export const ObjectFieldTemplate = (props : ObjectFieldTemplateProps) => {


  return (
    <div style={ true ? {} : {
      border: '100px solid rgba(100,0,0,0.05)',
    }}>

      { props.title }

      { props.description }

      { props.properties.map((component, idx) => (
          <div
            key={ idx }
            className="col-lg-2 col-md-4 col-sm-6 col-xs-12">
            {component.content}
          </div>
        ))}

    </div>
  );
}
