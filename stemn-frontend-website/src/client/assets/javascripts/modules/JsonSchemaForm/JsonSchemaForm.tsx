import * as React from 'react';
import Form, { FormProps } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { FieldTemplate } from './templates/FieldTemplate';
import { ArrayFieldTemplate } from './templates/ArrayFieldTemplate';
import { ObjectFieldTemplate } from './templates/ObjectFieldTemplate';
import { ErrorListTemplate } from './templates/ErrorListTemplate';
import { schema } from './exampleSchema';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as widgets from './widgets';

export class JsonSchemaForm<T> extends React.Component <FormProps<T>> {

  isLoading = false;

  componentWillMount () {}

  onChange =(data: any) => {
    console.log(data);
  }

  onSubmit = ({ formData }: { formData: any }) => {
    console.log({ formData })
    console.log('submitting')
  }

  render () {

    const templates = {
      ArrayFieldTemplate,
      FieldTemplate,
      ObjectFieldTemplate,
      ErrorList: ErrorListTemplate,
      widgets: widgets as any,
    };

    return (
      <InfoPanel>
        <Form
          schema={schema}
          onChange={this.onChange}
          onSubmit={ this.onSubmit }
          showErrorList={true}
          { ...templates }
        >
          <p> Required fields are denoted by '*' </p>

          <ProgressButton
            type='submit'
            className="primary"
            loading={ false }
            onClick={ () => {} }
          >
            Submit
          </ProgressButton>

        </Form>
      </InfoPanel>
    );
  }
}
