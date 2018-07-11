export const schema: any = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "properties": {
        "emailTest": {
            "type": "string",
            "format": "email"
        },
        "uriTest": {
            "type": "string",
            "format": "uri"
        },
        "dataTest": {
            "type": "string",
            "format": "data-url"
        },
        "dateTest": {
            "type": "string",
            "format": "date"
        },
        "dateTimeTest": {
            "type": "string",
            "format": "date-time"
        },
        "passwordField": {
            "type": "string",
            "format": "password"
        },
        "textAreaField": {
            "type": "string",
            "format": "textarea"
        },
        "colorField": {
            "type": "string",
            "format": "color"
        },
        "radioSelect": {
            "minItems": 2,
            "title": "A multiple-choice list",
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["foo", "bar", "fuzz", "qux"],
            },
        },
        "multipleSelect": {
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
