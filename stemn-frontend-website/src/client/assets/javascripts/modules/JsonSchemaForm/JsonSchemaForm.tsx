import * as React from 'react';
import Form, { FormProps } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import * as templates from './templates';
import { schema } from './exampleSchema';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as widgets from './widgets';

import { set } from 'lodash';
import { flow, replace } from 'lodash/fp';

export class JsonSchemaForm<T> extends React.Component <FormProps<T>> {

  state = {
    isLoading: false
  }

  form: any;

  fillFormErrors = (validationErrors: object[]) => {

    if (!validationErrors) {
      console.error('Errors has not been found');
      return;
    }

    const errorSchema = {};

    validationErrors.forEach((error: any) => {

      const errorPath = flow(
        replace('/body/data/', ''), // Replace body with nothing
        replace(/\//g, '.'), // Replace slashes with dots
        (path: string) => `${path}.__errors`, // Append __errors to the end
      )(error.source.pointer);

      set(errorSchema, errorPath, [error.detail]);

    });

    const errors = validationErrors.map((error: any) => ({ stack: error.detail }));
    this.form.setState({ errorSchema, errors });
  }

  onSubmit = ({ formData }: { formData: any }) => {

    console.log('submit')

    // this.setState({ isLoading: true });
    // this.form.setState({ errors: [], errorSchema: {} });

    // return this.props.onSubmit(formData)
    //   .then((response: any) => {

    //     this.setState({ isLoading: false });
    //     this.form.setState({ errors: [], errorSchema: {} });

    //     return response;
    //   })
    //   .catch((error: any) => {

    //     this.setState({ formData, isLoading: false });
    //     this.fillFormErrors(error.response.data.errors);

    //   });

  }

  render () {

    const configs = {
      ...templates,
      widgets: widgets as any,
    };

    return (
      <InfoPanel>
        <Form
          schema={schema}
          onSubmit={ this.onSubmit }
          liveValidate
          noHtml5Validate
          { ...configs }
        >
          <p> Required fields are denoted by '*' </p>

          <ProgressButton
            type='submit'
            className="primary"
            loading={ this.state.isLoading }
            onClick={() => {}}
          >
            Submit
          </ProgressButton>

        </Form>
      </InfoPanel>
    );
  }
}
