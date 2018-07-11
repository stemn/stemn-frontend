export const schema: any = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "properties": {
        "email_test": {
            "type": "string",
            "format": "email"
        },
        "uri_test": {
            "type": "string",
            "format": "uri"
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
        "textArea_Field": {
            "type": "string",
            "format": "textarea"
        },
        "color_Field": {
            "type": "string",
            "format": "color"
        },
        "multiple_Select": {
            "minItems": 2,
            "title": "A multiple-choice list",
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["foo", "bar", "fuzz", "qux"],
            },
        },
        "radio_select": {
            "title": "checkbox Example",
            "enum": ["v1", "v2", "v3"]
        },
        "to": {
            "items": {
                "type": "string"
            },
            "type": "array"
        },
        "subject": {
            "type": "string"
        },
        "body": {
            "type": "markdown"
        },
        "attachments": {
            "items": {
                "type": "string"
            },
            "type": "array"
        },
    },
    "type": "object",
    "required": ["to", "subject", "body"]
}
