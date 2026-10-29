import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const getStemnEnv = require('../stemnEnv.cjs')

describe('STEMN_ENV table', () => {
  afterEach(() => vi.restoreAllMocks())

  it('has the four environments', () => {
    expect(getStemnEnv.stemnEnvNames).toEqual(['custom', 'local', 'staging', 'production'])
  })

  it('maps local to the local backend ports', () => {
    expect(getStemnEnv('local')).toEqual({
      API_SERVER: 'http://localhost:3000',
      WEBSITE_URL: 'http://localhost:8081',
      WEBSOCKET_SERVER: 'http://localhost:8000',
    })
  })

  it('falls back to local (with a warning) for unknown names', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(getStemnEnv('nope')).toEqual(getStemnEnv('local'))
    expect(warn).toHaveBeenCalledOnce()
  })
})
