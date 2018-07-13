import * as React from 'react';
import { AjvError } from 'react-jsonschema-form';

export const ErrorList = ({ errors }: { errors: AjvError[] }) => {

  return null;

  // console.log({errors})
  // const isErrors = errors && errors.length > 0;

  // if (!isErrors) return null;

  // return (
  //   <div style={{ marginBottom: '20px' }}>
  //     {/* {errors.map((error: any) => {
  //       return (
  //         <p> { error.message } </p>
  //       );
  //     })} */}
  //   </div>
  // );
}
