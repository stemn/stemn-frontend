import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';

export const FieldTemplate = (props : FieldTemplateProps) => {
  const { classNames, label, required, description, rawErrors, rawHelp, children } = props;

  const helperText = getHelperText(rawErrors, rawHelp);

  return (
    <div className={classNames}>
      <div style={props.id === 'root' ? {} : {
        background: 'rgba(0,0,0,0)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        margin: '5px 10px',
      }}>

        <h3 style={ { marginTop: '10px', padding: '0px' } }> { label } { required ? '*' : '' } </h3>

        <p> { description } </p>

        { children }

        { helperText && (
          <p>
            {helperText.map((text, index) =>
              <p key={index}>{text}</p>,
            )}
          </p>
        )}

      </div>
    </div>
  );
}

const getHelperText = (errors: string[], help: string) => {
  if (errors) return errors;
  if (help) return [help];

  return '';
};
