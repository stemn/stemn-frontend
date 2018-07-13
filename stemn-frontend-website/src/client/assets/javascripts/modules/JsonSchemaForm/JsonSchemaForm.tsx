import * as React from 'react';
import { JSONSchema6 } from 'json-schema';
import Form, { FormProps, ISubmitEvent } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import * as templates from './templates';
import { fixFormatFields } from './utils/transformUiSchema'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as widgets from './widgets';

export interface ISchemaFormProps<T> {
  onSubmit: (e: ISubmitEvent<T>) => any;
}


export class JsonSchemaForm<T> extends React.Component<FormProps<T> & ISchemaFormProps<T>> {

  state = {
    isLoading: false,
    schema: {},
    uiSchema: {}
  }

  componentWillMount() {
    this.generateUiSchema(this.props.schema, this.props.uiSchema);
  }

  // read the readme in the docs folder
  generateUiSchema = (schema: JSONSchema6, uiSchema: any = {}) => {

    const unsupported = ["password", "textarea"];

    const { newSchema, newUiSchema } = fixFormatFields(unsupported, schema, uiSchema)

    this.setState({
      schema: newSchema,
      uiSchema: newUiSchema
    });
  }

  onSubmit = ({ formData }: { formData: any }) => {

    this.setState({ isLoading : true })

    return this.props.onSubmit(formData)
      .then((response: any) => {
        this.setState({ isLoading: false });
        return response;
      })
      .catch((error: any) => {
        this.setState({ isLoading: false });
      });
  }

  render() {

    const configs = {
      ...templates,
      widgets: widgets as any,
    };

    return (
      <InfoPanel>
        <Form
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          onSubmit={this.onSubmit}
          showErrorList={true}
          liveValidate={true}
          noHtml5Validate
          {...configs}
        >
          <p> Required fields are denoted by '*' </p>

          <ProgressButton
            type='submit'
            className="primary"
            loading={this.state.isLoading}
            onClick={() => { }}
          >
            Submit
          </ProgressButton>

        </Form>
      </InfoPanel>
    );
  }
}
