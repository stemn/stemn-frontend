import * as React from 'react';
import Form, { FormProps, ISubmitEvent } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as templates from './templates';
import { fixFormatFields, transformErrors } from './utils'
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

    const { newSchema, newUiSchema } = fixFormatFields(this.props.schema, this.props.uiSchema)

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
      .catch(() => {
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
          transformErrors={transformErrors}
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
