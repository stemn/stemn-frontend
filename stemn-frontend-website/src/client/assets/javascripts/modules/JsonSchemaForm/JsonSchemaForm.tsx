import * as React from 'react';
import Form, { FormProps } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { FieldTemplate } from './templates/FieldTemplate';
import { ArrayFieldTemplate } from './templates/ArrayFieldTemplate';
import { ObjectFieldTemplate } from './templates/ObjectFieldTemplate';
import { ErrorListTemplate } from './templates/ErrorListTemplate';
import { schema } from './exampleSchema';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import { Text, Email, Password } from './widgets';

export class JsonSchemaForm<T> extends React.Component <FormProps<T>> {

  isLoading = false;

  componentWillMount () {}

  onSubmit = ({ formData }: { formData: any }) => {
    console.log('submitting')
  }

  render () {
    const widgets : any = {
      // DescriptionField: null,
      // TitleField: null,
      // CheckboxWidget: null,
      TextWidget: Text,
      EmailWidget: Email,
      PasswordWidget: Password
    };

    return (
      <InfoPanel>
        <Form schema={schema}
          FieldTemplate={FieldTemplate}
          ArrayFieldTemplate={ArrayFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          showErrorList={true}
          ErrorList={ErrorListTemplate}
          onSubmit={ this.onSubmit }
          widgets={ widgets }
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
