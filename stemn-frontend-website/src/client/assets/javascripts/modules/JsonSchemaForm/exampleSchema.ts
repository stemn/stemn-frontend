export const schema: any = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "properties": {
      "attachments": {
          "items": {
              "type": "string"
          },
          "type": "array"
      },
      "body": {
          "type": "markdown"
      },
      "subject": {
          "type": "string"
      },
      "to": {
          "items": {
              "type": "string"
          },
          "type": "array"
      }
  },
  "type": "object",
  "required" : ["attachments"]
}
