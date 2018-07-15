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
                "color_required": {
                    "title": "color picker",
                    "type": "string",
                    "format": "color",
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
                "data_test_required": {
                    "type": "string",
                    "format": "data-url"
                },
                "date_test": {
                    "type": "string",
                    "format": "date"
                },
                "date_test_required": {
                    "type": "string",
                    "format": "date"
                },
                "dateTime_test": {
                    "type": "string",
                    "format": "date-time"
                },
                "dateTime_test_required": {
                    "type": "string",
                    "format": "date-time"
                }
            },
            "required": ["password_Field", "date_test_required", "dateTime_test_required", "data_test_required", "color_required"]
        },
        "boolean": {
            "type": "object",
            "title": "Boolean fields",
            "properties": {
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
                "selectWidgetOptions_required": {
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
                "radio": {
                    "type": "boolean",
                    "title": "radio buttons",
                    "description": "This is the radio-description"
                },
                "radio_required": {
                    "type": "boolean",
                    "title": "radio buttons",
                    "description": "This is the radio-description"
                }
            },
            "required": ["radio_required", "selectWidgetOptions_required"]
        }
    }
}
