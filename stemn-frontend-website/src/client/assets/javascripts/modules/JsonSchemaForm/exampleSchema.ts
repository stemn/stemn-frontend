export const schema: any = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "properties": {
        "string": {
            "type": "object",
            "title": "String field",
            "properties": {
                "default": {
                    "type": "string",
                    "title": "text input (default)"
                },
                "textarea": {
                    "type": "string",
                    "title": "textarea"
                },
                "email_test": {
                    "type": "string",
                    "format": "email"
                },
                "uri_test": {
                    "type": "string",
                    "format": "uri"
                },
                "color": {
                    "type": "string",
                    "title": "color picker",
                    "format": "color",
                    "default": "#151ce6"
                },
                "password_Field": {
                    "type": "string",
                    "format": "password"
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
            }
        },
        "boolean": {
            "type": "object",
            "title": "Boolean fields",
            "properties": {
              "default": {
                "type": "array",
                "title": "checkbox",
                "description": "This is the checkbox-description",
                "items": {
                    "type": 'object',
                    "properties": {
                    "text": {
                        "description": 'Location name.',
                        "type": 'boolean',
                    },
                    "checkbox": {
                        "description": 'Is Click an collect?',
                        "type": 'boolean',
                    },
                    },
                },
              },
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
          }

    },
    "type": "object",
    "required": []
}
