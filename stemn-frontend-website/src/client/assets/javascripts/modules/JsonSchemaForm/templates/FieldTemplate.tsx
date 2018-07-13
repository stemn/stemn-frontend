import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';

export const FieldTemplate = (props : FieldTemplateProps) => {
  const { id, classNames, label, required, rawErrors, help, children } = props;

  return (
    <div className={classNames}>
      <div style={props.id === 'root' ? {} : {
        background: 'rgba(0,0,0,0)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        margin: '5px 10px',
      }}>

        <h3 style={ { marginTop: '10px', padding: '0px' } }> { label } { required ? '*' : '' } </h3>

        { children }

        { help }

        { rawErrors && rawErrors.map((error, idx) => {
            return (
              <p key={`${id}.${idx}`} style={ { color: 'red' } }> {error}</p>
            )
          })
        }

      </div>
    </div>
  );
}
