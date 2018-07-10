import * as React from 'react';
import Form from 'react-jsonschema-form';

import { FieldTemplate } from './templates/FieldTemplate';
import { ArrayFieldTemplate } from './templates/ArrayFieldTemplate';
import { ObjectFieldTemplate } from './templates/ObjectFieldTemplate';
import { ErrorListTemplate } from './templates/ErrorListTemplate';
import { schema } from './exampleSchema';

export class JsonSchemaForm<T> extends React.Component {

  isLoading = false;

  componentWillMount () {

  }

  onSubmit = ({ formData }: { formData: any }) => {

  }

  render () {


    return (
      <div>
        <Form schema={schema}
          FieldTemplate={FieldTemplate}
          ArrayFieldTemplate={ArrayFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          showErrorList={true}
          ErrorList={ErrorListTemplate}
        />
      </div>
    );
  }
}
