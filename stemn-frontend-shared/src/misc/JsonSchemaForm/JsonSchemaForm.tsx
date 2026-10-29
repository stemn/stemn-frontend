import Form, { FormProps } from '@rjsf/core'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import * as React from 'react'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import * as templates from 'stemn-shared/misc/JsonSchemaForm/templates'
import { fixFormatFields, transformErrors } from 'stemn-shared/misc/JsonSchemaForm/utils'
import * as widgets from 'stemn-shared/misc/JsonSchemaForm/widgets'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export interface ISchemaFormProps<T> {
  schema: RJSFSchema,
  uiSchema?: UiSchema<T>,
  onSubmit: (formData: T) => any
}

export interface ISchemaFormState {
  isLoading: boolean,
  schema: RJSFSchema,
  uiSchema: UiSchema,
}

const formTemplates: FormProps['templates'] = {
  ArrayFieldTemplate: templates.ArrayFieldTemplate,
  ArrayFieldItemTemplate: templates.ArrayFieldItemTemplate,
  ErrorListTemplate: templates.ErrorList,
  FieldTemplate: templates.FieldTemplate,
  ObjectFieldTemplate: templates.ObjectFieldTemplate,
}

const formWidgets = { ...widgets } as FormProps['widgets']

export class JsonSchemaForm<T = any> extends React.Component<ISchemaFormProps<T>, ISchemaFormState> {

  constructor (props: ISchemaFormProps<T>) {
    super(props)

    const { newSchema, newUiSchema } = fixFormatFields(props.schema, props.uiSchema)

    this.state = {
      isLoading: false,
      schema: newSchema,
      uiSchema: newUiSchema,
    }
  }

  public onSubmit = ({ formData }: { formData?: T }) => {

    this.setState({ isLoading : true })

    return Promise.resolve(this.props.onSubmit(formData as T))
      .then((response: any) => {
        this.setState({ isLoading: false })
        return response
      })
      .catch(() => {
        this.setState({ isLoading: false })
      })
  }

  public render () {

    return (
      <InfoPanel>
        <Form
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          validator={validator}
          templates={formTemplates}
          widgets={formWidgets}
          transformErrors={transformErrors}
          onSubmit={this.onSubmit}
          showErrorList={false}
          liveValidate='onChange'
          noHtml5Validate={true}
        >
          <p> Required fields are denoted by '*' </p>

          <ProgressButton
            type='submit'
            className='primary'
            loading={this.state.isLoading}
            onClick={() => undefined}
          >
            Submit
          </ProgressButton>

        </Form>
      </InfoPanel>
    )
  }
}
