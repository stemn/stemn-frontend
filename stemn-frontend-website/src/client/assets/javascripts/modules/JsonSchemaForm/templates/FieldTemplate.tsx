import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';

export const FieldTemplate = (props : FieldTemplateProps) => {
  const { classNames, label, required, description, rawErrors, rawHelp, rawDescription, children, schema } = props;

  const isRoot = props.id === 'root';

  const hideDescription = schema.type === 'object';
  const helperText = getHelperText(
    rawErrors,
    rawHelp,
    hideDescription ? '' : rawDescription,
  );

  return (
    <div className={classNames}>
      <div style={isRoot ? {} : {
        background: 'rgba(0,0,0,0)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        margin: '5px 10px',
      }}>

        <h3 style={ { marginTop: '10px' } }> { label } { required ? '*' : '' } </h3>

        {/* <p> { description } </p> */}

        {/* {isRoot ? children :
           <Input
           model={ `` }
           value={ '' }
           className="dr-input flex"
           type="text"
           placeholder={ description }
         />} */}

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

const getHelperText = (errors: string[], help: string, description: string) => {
  if (errors) {
    return errors;
  } else if (help) {
    return [help];
  } else if (description) {
    return [description];
  }
};
