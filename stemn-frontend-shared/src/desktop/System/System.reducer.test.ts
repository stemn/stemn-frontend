import { describe, expect, it } from 'vitest'
import reducer from './System.reducer'

describe('System reducer', () => {
  const hydrated: any = {
    installed: true,
    providerPath: { dropbox: '/home/user/Dropbox', drive: null, onedrive: null },
    settings: { usageData: true, autoUpdate: true, debug: false },
    hydrated: true,
  }

  it('deep-merges a persisted state over the initial state on hydration', () => {
    const persisted = { providerPath: { dropbox: '/data/Dropbox' }, settings: { debug: true } }
    const next = reducer(persisted, { type: 'OTHER' })
    expect(next).toEqual({
      installed: false,
      providerPath: { dropbox: '/data/Dropbox', drive: null, onedrive: null },
      settings: { usageData: true, autoUpdate: true, debug: true },
      hydrated: true,
    })
    expect(persisted).toEqual({ providerPath: { dropbox: '/data/Dropbox' }, settings: { debug: true } })
  })

  it('hydrates the default state, sharing the untouched initial branches', () => {
    const first = reducer(undefined, { type: 'OTHER' })
    const second = reducer(undefined, { type: 'OTHER' })
    expect(first).toEqual({ ...second, hydrated: true })
    expect(first.providerPath).toBe(second.providerPath)
  })

  it('SYSTEM/GET_PROVIDER_PATH_FULFILLED stores the provider path', () => {
    const next = reducer(hydrated, {
      type: 'SYSTEM/GET_PROVIDER_PATH_FULFILLED',
      meta: { provider: 'drive' },
      payload: '/home/user/Google Drive',
    })
    expect(next.providerPath).toEqual({ ...hydrated.providerPath, drive: '/home/user/Google Drive' })
    expect(next.settings).toBe(hydrated.settings)
  })

  it('SYSTEM/GET_INSTALL_STATUS_FULFILLED and _REJECTED store the install status', () => {
    const fulfilled = reducer(hydrated, { type: 'SYSTEM/GET_INSTALL_STATUS_FULFILLED', payload: false })
    expect(fulfilled.installed).toBe(false)
    expect(fulfilled.providerPath).toBe(hydrated.providerPath)
    const rejected = reducer(fulfilled, { type: 'SYSTEM/GET_INSTALL_STATUS_REJECTED', payload: true })
    expect(rejected.installed).toBe(true)
  })

  it('returns the same hydrated state when nothing changes', () => {
    expect(reducer(hydrated, { type: 'SYSTEM/GET_INSTALL_STATUS_FULFILLED', payload: true })).toBe(hydrated)
    expect(reducer(hydrated, { type: 'OTHER' })).toBe(hydrated)
  })
})
