import { RJSFValidationError } from '@rjsf/utils'

const messages: any = {
  email: 'Please enter a valid email',
  limit: (length: number) => `Minimum length required is ${length}`,
  required: 'This is a required field',
}

export const transformErrors = (errors: RJSFValidationError[]): RJSFValidationError[] => {
  return errors.map((error) => {
    const params = error.params || {}

    if (params.format) {
      error.message = messages[params.format] || error.message
    }

    if (params.limit) {
      error.message = messages.limit(params.limit)
    }

    if (error.name === 'required') {
      error.message = messages.required
    }

    return error
  })
}
