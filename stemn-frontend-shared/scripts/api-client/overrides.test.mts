import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { applyOverrides, overrides } from './overrides.mjs'

const snapshot = JSON.parse(readFileSync(join(import.meta.dirname, '../../src/api/openapi.json'), 'utf8'))

describe('spec overrides', () => {
  it('each override still corrects the committed snapshot (none is stale)', () => {
    expect(applyOverrides(snapshot).stale).toEqual([])
  })

  it('reports every override as stale once the document is already correct', () => {
    const { spec } = applyOverrides(snapshot)
    expect(applyOverrides(spec).stale).toEqual(overrides.map((override) => override.id))
  })

  it('does not modify the input document', () => {
    const before = JSON.stringify(snapshot)
    applyOverrides(snapshot)
    expect(JSON.stringify(snapshot)).toBe(before)
  })
})
