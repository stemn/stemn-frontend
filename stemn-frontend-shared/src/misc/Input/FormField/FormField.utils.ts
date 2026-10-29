/**
 * The value semantics the previous form library gave its `Field` components, kept for the
 * react-hook-form `FormField` so the field components and submit payloads behave as before.
 */

const isEvent = (candidate: any): boolean => !!(candidate && candidate.stopPropagation && candidate.preventDefault)

/** The value an onChange/onBlur argument carries: an event's target value (checkbox: checked, file: files) or the raw value. */
export const getFieldEventValue = (event: any): any => {
  if (!isEvent(event)) return event
  if (event.nativeEvent && event.nativeEvent.text !== undefined) return event.nativeEvent.text
  const { target = {}, dataTransfer } = event
  if (target.type === 'checkbox') return !!target.checked
  if (target.type === 'file') return target.files || (dataTransfer && dataTransfer.files)
  if (target.type === 'select-multiple') {
    return Array.from(target.options || [])
      .filter((option: any) => option.selected)
      .map((option: any) => option.value)
  }
  return target.value
}

/** Clearing a field that had no initial value removes it from the values (it submits as undefined, not ''). */
export const toStoredValue = (value: any, initialValue: any): any =>
  initialValue === undefined && value === '' ? undefined : value

/** What the field component is given as `input.value`: '' for a missing value. */
export const toInputValue = (value: any): any => (value == null ? '' : value)

/** Fields show as touched once blurred or once the form has been submitted (or is submitting). */
export const isFieldTouched = (isTouched: boolean, isSubmitting: boolean, isSubmitted: boolean): boolean =>
  isTouched || isSubmitting || isSubmitted
