# Schema and UISchema Configuration documentation

BELOW SPECIFIES THE NORMAL WAY THAT THE DOCUMENTS ARE RENDERED

In the javascript file JsonSchemaForm.tsx I autogenerate the UI schema, so the below is only to understand why I did what I did

## String Formatting

The following formats are supported in the main schema object

- email
- uri
- color
- data-url
- date
- date-time

and can be specified like

```
schema = {
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
```

Any other format in the text field will break the validation for the form ...

## Widgets

To specify password fields and text areas you usually need to build a uiSchema object to override the default widget such that

```
uiSchema = {
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
```
