export const schema: any = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Hmm",
    "type": "object",
    "required": [],
    "properties": {
        "string": {
            "title": "fields",
            "type": "object",
            "properties": {
                "normal": {
                    "type": "string",
                },
                "textarea": {
                    "type": "string",
                    "format": "textarea" // usually this would break validation
                },
                "emailField": {
                    "type": "string",
                    "title": "email",
                    "format": "email"
                },
                "uri_test": {
                    "type": "string",
                    "format": "uri"
                },
                "color": {
                    "title": "color picker",
                    "type": "string",
                    "format": "color",
                    "default": "#151ce6"
                },
                "password_Field": {
                    "type": "string",
                    "minLength": 8,
                    "format": "password", // this would usually break the validation
                    "help": "some help message"
                },
                "data_test": {
                    "type": "string",
                    "format": "data-url"
                },
                "date_test": {
                    "type": "string",
                    "format": "date"
                },
                "dateTime_test": {
                    "type": "string",
                    "format": "date-time"
                }
            },
            "required": ["password_Field"]
        },
        "boolean": {
            "type": "object",
            "title": "Boolean fields",
            "properties": {
              "thisIsADropdownField": {
                "description": 'Location type.',
                "enum": [
                  'Drop Shipper',
                  'Headquarters',
                  'Store',
                  'Warehouse',
                ],
                "type": 'string',
              },
              "radio": {
                "type": "boolean",
                "title": "radio buttons",
                "description": "This is the radio-description"
              },
              "select": {
                "type": "boolean",
                "title": "select box",
                "description": "This is the select-description"
              }
            }
          },
          "selectWidgetOptions": {
            "title": "Custom select widget with options",
            "type": "string",
            "enum": [
              "foo",
              "bar"
            ],
            "enumNames": [
              "Foo",
              "Bar"
            ]
          },
    }
}

// the old style of formatting
export const schema2 : any = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    title: "schema2",
    type: "object",
    required: [],
    properties: {
        sub: {
            title: "subObject",
            type: "object",
            properties: {
                email: {
                    title: "I am the title of this email thingo",
                    type: "string",
                    format: "email"
                },
                password: {
                    type: "string",
                },
                textarea: {
                    title: "this is a textarea",
                    type: "string"
                }
            }
        }
    }
}

export const uiSchema2 : any = {
    sub: {
        textarea: {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 5
            }
        },
        password: {
            "ui:widget": "password"
        }
    },
}
