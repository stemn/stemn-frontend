import { describe, expect, it } from 'vitest'
import { CALL_HISTORY_METHOD, LOCATION_CHANGE, goBack, push, replace } from './actions'
import { parseQuery, stringifyQuery, toLegacyLocation, toRouterPath } from './query'
import { routerReducer } from './reducer'

describe('routing shim: query helpers', () => {
  it('parses repeated keys into arrays like react-router v3', () => {
    expect(parseQuery('?a=1&b=2&b=3')).toEqual({ a: '1', b: ['2', '3'] })
    expect(parseQuery('')).toEqual({})
  })

  it('stringifies, dropping null/undefined and repeating arrays', () => {
    expect(stringifyQuery({ a: 1, b: ['x', 'y'], c: undefined, d: null })).toBe('?a=1&b=x&b=y')
    expect(stringifyQuery({})).toBe('')
    expect(stringifyQuery()).toBe('')
  })

  it('round-trips a query', () => {
    const query = { term: 'cube sat', type: ['project', 'user'] }
    expect(parseQuery(stringifyQuery(query))).toEqual(query)
  })

  it('converts v3 location descriptors for navigate()', () => {
    expect(toRouterPath('/explore')).toEqual({ to: '/explore', state: undefined })
    expect(toRouterPath({ pathname: '/search', query: { term: 'a' }, state: { x: 1 } })).toEqual({
      to: { pathname: '/search', search: '?term=a', hash: '' },
      state: { x: 1 },
    })
  })

  it('adds the parsed query to a router location', () => {
    expect(toLegacyLocation({ pathname: '/p', search: '?a=1', key: 'k' }, 'PUSH')).toEqual({
      pathname: '/p',
      search: '?a=1',
      hash: '',
      state: null,
      key: 'k',
      action: 'PUSH',
      query: { a: '1' },
    })
  })
})

describe('routing shim: actions and reducer', () => {
  it('creates react-router-redux style history actions', () => {
    expect(push('/a')).toEqual({ type: CALL_HISTORY_METHOD, payload: { method: 'push', args: ['/a'] } })
    expect(replace({ pathname: '/b' })).toEqual({
      type: CALL_HISTORY_METHOD,
      payload: { method: 'replace', args: [{ pathname: '/b' }] },
    })
    expect(goBack()).toEqual({ type: CALL_HISTORY_METHOD, payload: { method: 'goBack', args: [] } })
  })

  it('stores the location under locationBeforeTransitions', () => {
    const initial = routerReducer(undefined, { type: '@@INIT' })
    expect(initial).toEqual({ locationBeforeTransitions: null })
    const location = toLegacyLocation({ pathname: '/x', search: '' })
    const next = routerReducer(initial, { type: LOCATION_CHANGE, payload: location })
    expect(next.locationBeforeTransitions).toBe(location)
    expect(initial.locationBeforeTransitions).toBeNull()
    expect(routerReducer(next, { type: 'OTHER' })).toBe(next)
  })
})
