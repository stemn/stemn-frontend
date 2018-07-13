import { AjvError } from 'react-jsonschema-form';

const messages : any = {
  email: 'Please enter a valid email',
  limit: (length : number) => `The minimum length required is ${length}`,
  required: 'This is a required field'
}

export const transformErrors = (errors: AjvError[]): AjvError[] => {

  return errors.map(error => {

    if (error.params.format) {
      error.message = messages[error.params.format]
    }

    if (error.params.limit) {
      error.message = messages.limit(error.params.limit)
    }

    if (error.name === 'required') {
      error.message = messages.required
    }

    return error;
  });
}
