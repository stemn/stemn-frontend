import * as React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { getFieldEventValue, isFieldTouched, toInputValue, toStoredValue } from './FormField.utils'

/** The `input` prop a form field component gets (the shape the previous form library's Field passed). */
export interface IFieldInputProps {
  name: string
  value: any
  onChange: (eventOrValue: any) => void
  onBlur: (eventOrValue?: any) => void
  onFocus: () => void
  onDragStart: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
}

/** The `meta` prop: errors are meant to be shown once `touched` (blurred or submitted). */
export interface IFieldMetaProps {
  touched: boolean
  error?: string
  invalid: boolean
  submitting: boolean
  submitFailed: boolean
}

export interface IFieldProps {
  input: IFieldInputProps
  meta: IFieldMetaProps
}

export type IFormFieldProps<TValues extends FieldValues> = {
  control: Control<TValues>
  name: Path<TValues>
  component: React.ComponentType<any>
} & Record<string, any>

/** react-hook-form field that renders `component` with `input`/`meta` props like the previous form library's Field. */
export const FormField = <TValues extends FieldValues>({
  control,
  name,
  component: FieldComponent,
  ...otherProps
}: IFormFieldProps<TValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState, formState }) => {
      const initialValue = (formState.defaultValues as Record<string, any> | undefined)?.[name]
      const change = (value: any) => field.onChange(toStoredValue(value, initialValue))
      const input: IFieldInputProps = {
        name: field.name,
        value: toInputValue(field.value),
        onChange: (eventOrValue) => change(getFieldEventValue(eventOrValue)),
        onBlur: (eventOrValue) => {
          const value = getFieldEventValue(eventOrValue)
          if (value !== undefined && toStoredValue(value, initialValue) !== field.value) change(value)
          field.onBlur()
        },
        onFocus: () => undefined,
        onDragStart: (event) => event.dataTransfer.setData('text', toInputValue(field.value)),
        onDrop: (event) => {
          change(event.dataTransfer.getData('text'))
          event.preventDefault()
        },
      }
      const meta: IFieldMetaProps = {
        touched: isFieldTouched(fieldState.isTouched, formState.isSubmitting, formState.isSubmitted),
        error: fieldState.error?.message,
        invalid: fieldState.invalid,
        submitting: formState.isSubmitting,
        submitFailed: formState.isSubmitted && !formState.isSubmitSuccessful,
      }
      return <FieldComponent {...otherProps} input={input} meta={meta} />
    }}
  />
)
