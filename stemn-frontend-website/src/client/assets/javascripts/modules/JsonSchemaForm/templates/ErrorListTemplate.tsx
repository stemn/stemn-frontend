import * as React from 'react';
import { AjvError } from 'react-jsonschema-form';


export const ErrorListTemplate = ({ errors }: { errors: AjvError[] }) => {

  const isErrors = errors && errors.length > 0;

  if (!isErrors) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* { errors } */}
    </div>
  );
}
