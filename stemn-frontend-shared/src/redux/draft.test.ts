import { produce } from 'immer'
import { describe, expect, it } from 'vitest'
import { mergeDeep, setIn } from './draft'

describe('setIn', () => {
  it('sets a nested value, copying only the changed path', () => {
    const state = { a: { b: { c: 1 }, d: { e: 2 } }, f: { g: 3 } }
    const next = produce(state, (draft) => {
      setIn(draft, ['a', 'b', 'c'], 5)
    })
    expect(next).toEqual({ a: { b: { c: 5 }, d: { e: 2 } }, f: { g: 3 } })
    expect(next.a).not.toBe(state.a)
    expect(next.a.d).toBe(state.a.d)
    expect(next.f).toBe(state.f)
  })

  it('creates missing (and falsy) intermediates as plain objects, also for numeric keys', () => {
    const state: any = { a: null, list: undefined }
    const next = produce(state, (draft) => {
      setIn(draft, ['a', 'b'], 1)
      setIn(draft, ['list', 0, 'name'], 'first')
    })
    expect(next).toEqual({ a: { b: 1 }, list: { 0: { name: 'first' } } })
    expect(Array.isArray(next.list)).toBe(false)
  })

  it('copies a non-plain intermediate instead of mutating it', () => {
    class Holder {
      value = 1
    }
    const holder = new Holder()
    const state = { holder }
    const next: any = produce(state, (draft) => {
      setIn(draft, ['holder', 'other'], 2)
    })
    expect(next.holder).toEqual({ value: 1, other: 2 })
    expect(holder).toEqual(new Holder())
  })

  it('does not mutate an object assigned earlier in the same recipe', () => {
    const payload = { _id: 'c1', body: 'Hello' }
    const state: any = { data: {} }
    const next = produce(state, (draft) => {
      setIn(draft, ['data', 'c1'], payload)
      setIn(draft, ['data', 'c1', 'editActive'], true)
    })
    expect(next.data.c1).toEqual({ _id: 'c1', body: 'Hello', editActive: true })
    expect(payload).toEqual({ _id: 'c1', body: 'Hello' })
  })

  it('returns the same state when the value is already set', () => {
    const data = { _id: 'p1' }
    const state = { project: { loading: false, data } }
    expect(produce(state, (draft) => setIn(draft, ['project', 'loading'], false))).toBe(state)
    expect(produce(state, (draft) => setIn(draft, ['project', 'data'], data))).toBe(state)
  })

  it('treats setting undefined on a missing key as a no-op, but keeps an explicit undefined otherwise', () => {
    const state: any = { data: { c1: { loading: true } } }
    expect(produce(state, (draft) => setIn(draft, ['data', 'c2'], undefined))).toBe(state)
    const next = produce(state, (draft) => setIn(draft, ['data', 'c1'], undefined))
    expect(next.data).toHaveProperty('c1', undefined)
  })
})

describe('mergeDeep', () => {
  it('merges plain objects recursively and keeps untouched branches', () => {
    const state = { a: { b: 1, c: { d: 2 } }, e: { f: 3 } }
    const next = produce(state, (draft) => {
      mergeDeep(draft, { a: { b: 5 } })
    })
    expect(next).toEqual({ a: { b: 5, c: { d: 2 } }, e: { f: 3 } })
    expect(next.a.c).toBe(state.a.c)
    expect(next.e).toBe(state.e)
  })

  it('replaces arrays and non-plain values instead of merging them', () => {
    const error = new Error('boom')
    const state: any = { list: [1, 2, 3], error: { message: 'old' }, nested: { x: 1 } }
    const next = produce(state, (draft) => {
      mergeDeep(draft, { list: [4], error, nested: 'flat' })
    })
    expect(next.list).toEqual([4])
    expect(next.error).toBe(error)
    expect(next.nested).toBe('flat')
  })

  it('merging an empty object into an existing one is a no-op', () => {
    const state = { checked: { f1: true }, other: {} }
    expect(produce(state, (draft) => mergeDeep(draft, { checked: {} }))).toBe(state)
  })

  it('assigns source objects where the target has no plain object', () => {
    const source = { mode: 'side-by-side' }
    const state: any = { existing: { mode: 'single' } }
    const next = produce(state, (draft) => mergeDeep(draft, { added: source }))
    expect(next.added).toEqual(source)
    expect(next.existing).toBe(state.existing)
  })

  it('does not mutate an object assigned earlier in the same recipe', () => {
    const payload = { mode: 'single', selected: 1 }
    const state: any = {}
    const next = produce(state, (draft) => {
      draft.compare = payload
      mergeDeep(draft, { compare: { mode: 'sideBySide' } })
    })
    expect(next.compare).toEqual({ mode: 'sideBySide', selected: 1 })
    expect(payload).toEqual({ mode: 'single', selected: 1 })
  })

  it('returns the same state when every merged value is unchanged', () => {
    const list = [1, 2]
    const state = { a: { b: 1, list }, c: 'x' }
    expect(produce(state, (draft) => mergeDeep(draft, { a: { b: 1, list }, c: 'x' }))).toBe(state)
  })

  it('ignores a missing target or source', () => {
    const state: any = { a: undefined, b: { c: 1 } }
    expect(produce(state, (draft) => mergeDeep(draft.a, { c: 2 }))).toBe(state)
    expect(produce(state, (draft) => mergeDeep(draft.b, undefined))).toBe(state)
  })
})
