import * as React from 'react';
import { JSONSchema6 } from 'json-schema';
import Form, { FormProps } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import * as templates from './templates';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as widgets from './widgets';

import { set, cloneDeep, assign } from 'lodash';
import { flow, replace } from 'lodash/fp';

export class JsonSchemaForm<T> extends React.Component<FormProps<T>> {

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

    const unsupportedFormats = ["password", "textarea"];
    const newSchema: JSONSchema6 = cloneDeep(schema);
    const newUiSchema: any = cloneDeep(uiSchema);

    /**
     * builds a nested object given a '.' separated path, returns a reference to the last object
     * IE,
     *
     * path = string.hello
     *
     * will create the object
     * {
     *  string: {
     *    hello: {
     *
     *    }
     *   }
     * }
     *
     * the returned reference would be to the hello object
     */
    const buildObject = (path: string, object: any) : any => {

      const subObjects = path.split('.')

      let currentRef = object;
      for (let key of subObjects) {

        if (!currentRef[key]) {
          currentRef[key] = {}
        }

        currentRef = currentRef[key]
      }

      return currentRef;
    }

    const traverse = (object: any, uiSchema: any, path: string = '') => {

      if (!object) return;

      if (object.hasOwnProperty('properties')) {

        const subObject = object.properties;

        const keys = Object.keys(subObject);

        for (let key of keys) {

          const newPath = path === '' ? key : `${path}.${key}`

          // recurse through the object
          traverse(subObject[key], uiSchema, newPath)
        }
      } else if (object.hasOwnProperty('format') && unsupportedFormats.includes(object.format)) {

        // build the schema object
        const ref = buildObject(path, uiSchema)

        ref['ui:widget'] = object.format
        delete object.format
      }
    }

    traverse(newSchema, newUiSchema);

    this.setState({
      schema: newSchema,
      uiSchema: newUiSchema
    });
  }

  onSubmit = (params: any) => {

    // console.log({params})
    console.log('submit')
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
