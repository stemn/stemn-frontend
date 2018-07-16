import { JSONSchema6 } from 'json-schema'
import { cloneDeep } from 'lodash'

const formats = ['password', 'textarea']

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
const buildNestedObject = (path: string, object: any): any => {

  const subObjects = path.split('.')

  let currentRef = object
  for (const key of subObjects) {

    if (!currentRef[key]) {
      currentRef[key] = {}
    }

    currentRef = currentRef[key]
  }

  return currentRef
}

export const fixFormatFields = (schema: JSONSchema6, uiSchema: any = {}) => {

  const newSchema: JSONSchema6 = cloneDeep(schema)
  const newUiSchema: any = cloneDeep(uiSchema)

  const traverse = (object: any, uiSchema: any, path: string = '') => {

    if (!object) { return }

    if (object.hasOwnProperty('properties')) {

      const subObject = object.properties

      const keys = Object.keys(subObject)

      for (const key of keys) {

        const newPath = path === '' ? key : `${path}.${key}`

        // recurse through the object
        traverse(subObject[key], uiSchema, newPath)
      }
    }

    // build the schema object
    const ref = buildNestedObject(path, uiSchema)

    if (object.hasOwnProperty('format') && formats.includes(object.format)) {

      // change the widget for that object so that it displays as wanted
      ref['ui:widget'] = object.format

      // remove the key from the original object
      delete object.format
    }

    if (object.hasOwnProperty('help')) {

      ref['ui:help'] = object.help
      delete object.help
    }
  }

  traverse(newSchema, newUiSchema)

  return {
    newSchema,
    newUiSchema,
  }
}
