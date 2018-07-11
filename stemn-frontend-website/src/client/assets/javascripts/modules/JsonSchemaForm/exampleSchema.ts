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
                },
                "password_Field": {
                    "type": "string",
                    "format": "password"
                },
            }
        },
        "boolean": {
            "type": "object",
            "title": "Boolean fields",
            "properties": {
              "default": {
                "type": "boolean",
                "title": "checkbox",
                "description": "This is the checkbox-description"
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
