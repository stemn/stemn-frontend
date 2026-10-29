import { describe, expect, it } from 'vitest'
import { getFieldEventValue, isFieldTouched, toInputValue, toStoredValue } from './FormField.utils'

const event = (target: object, extra: object = {}) => ({
  stopPropagation: () => undefined,
  preventDefault: () => undefined,
  target,
  ...extra,
})

describe('getFieldEventValue', () => {
  it('passes raw values through', () => {
    expect(getFieldEventValue('pipeline')).toBe('pipeline')
    expect(getFieldEventValue(true)).toBe(true)
    expect(getFieldEventValue(undefined)).toBe(undefined)
    expect(getFieldEventValue({ value: 'not an event' })).toEqual({ value: 'not an event' })
  })

  it('reads the target value of an event', () => {
    expect(getFieldEventValue(event({ type: 'text', value: 'readme' }))).toBe('readme')
    expect(getFieldEventValue(event({ type: 'text', value: '' }))).toBe('')
    expect(getFieldEventValue(event({}))).toBe(undefined)
  })

  it('reads checkboxes, files and multi-selects like the previous form library did', () => {
    expect(getFieldEventValue(event({ type: 'checkbox', checked: 1, value: 'on' }))).toBe(true)
    expect(getFieldEventValue(event({ type: 'checkbox', value: 'on' }))).toBe(false)
    const files = ['a.txt']
    expect(getFieldEventValue(event({ type: 'file', files }))).toBe(files)
    expect(getFieldEventValue(event({ type: 'file' }, { dataTransfer: { files } }))).toBe(files)
    const options = [
      { value: 'a', selected: true },
      { value: 'b', selected: false },
      { value: 'c', selected: true },
    ]
    expect(getFieldEventValue(event({ type: 'select-multiple', options }))).toEqual(['a', 'c'])
  })

  it('prefers nativeEvent.text when present', () => {
    expect(getFieldEventValue(event({ value: 'x' }, { nativeEvent: { text: 'native' } }))).toBe('native')
  })
})

describe('toStoredValue', () => {
  it("drops '' for fields without an initial value", () => {
    expect(toStoredValue('', undefined)).toBe(undefined)
    expect(toStoredValue('', 'pipeline')).toBe('')
    expect(toStoredValue('readme', undefined)).toBe('readme')
    expect(toStoredValue(0, undefined)).toBe(0)
    expect(toStoredValue(false, undefined)).toBe(false)
  })
})

describe('toInputValue', () => {
  it("gives '' for missing values", () => {
    expect(toInputValue(undefined)).toBe('')
    expect(toInputValue(null)).toBe('')
    expect(toInputValue(0)).toBe(0)
    expect(toInputValue(false)).toBe(false)
    expect(toInputValue('md')).toBe('md')
  })
})

describe('isFieldTouched', () => {
  it('is touched after blur, during and after submit', () => {
    expect(isFieldTouched(false, false, false)).toBe(false)
    expect(isFieldTouched(true, false, false)).toBe(true)
    expect(isFieldTouched(false, true, false)).toBe(true)
    expect(isFieldTouched(false, false, true)).toBe(true)
  })
})
