import { describe, expect, it, vi } from 'vitest'
import reducer from './AutoUpdate.reducer'

describe('AutoUpdate reducer', () => {
  const prev: any = {
    currentVersion: '1.1.0',
    checkingForUpdate: false,
    updateAvailable: false,
    updateDownloaded: true,
    release: { update: 'https://example.com/update', version: '1.1.0', platform: 'linux', readme: 'Notes' },
    updateError: false,
    updateNotAvailable: false,
    hydrated: true,
  }

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ currentVersion: '1.0.0' }, { type: 'OTHER' })
    expect(next).toMatchObject({ currentVersion: '1.0.0', checkingForUpdate: false, release: {}, hydrated: true })
  })

  it('AUTO_UPDATE/CURRENT_VERSION stores the version', () => {
    const next = reducer(prev, { type: 'AUTO_UPDATE/CURRENT_VERSION', payload: { version: '1.2.0' } })
    expect(next).toEqual({ ...prev, currentVersion: '1.2.0' })
    expect(next.release).toBe(prev.release)
  })

  it('AUTO_UPDATE/CHECK_FOR_UPDATES resets the flags; the deep merge keeps the existing release', () => {
    const next = reducer(prev, { type: 'AUTO_UPDATE/CHECK_FOR_UPDATES' })
    expect(next).toEqual({ ...prev, checkingForUpdate: true, updateDownloaded: false })
    expect(next.release).toBe(prev.release)
  })

  it('AUTO_UPDATE/UPDATE_AVAILABLE flags the update', () => {
    const next = reducer({ ...prev, checkingForUpdate: true }, { type: 'AUTO_UPDATE/UPDATE_AVAILABLE' })
    expect(next.updateAvailable).toBe(true)
    expect(next.checkingForUpdate).toBe(false)
    expect(next.release).toBe(prev.release)
  })

  it('AUTO_UPDATE/UPDATE_DOWNLOADED stores the release', () => {
    const payload = {
      update: 'https://example.com/1.2.0',
      version: '1.2.0',
      platform: 'linux',
      readme: 'New',
      extra: 1,
    }
    const next = reducer({ ...prev, updateDownloaded: false }, { type: 'AUTO_UPDATE/UPDATE_DOWNLOADED', payload })
    expect(next.updateDownloaded).toBe(true)
    expect(next.release).toEqual({ update: payload.update, version: '1.2.0', platform: 'linux', readme: 'New' })
  })

  it('AUTO_UPDATE/UPDATE_ERROR stores the error', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const error = new Error('Network down')
    const next = reducer({ ...prev, checkingForUpdate: true }, { type: 'AUTO_UPDATE/UPDATE_ERROR', payload: error })
    expect(next.updateError).toBe(error)
    expect(next.checkingForUpdate).toBe(false)
    expect(next.release).toBe(prev.release)
    log.mockRestore()
  })

  it('AUTO_UPDATE/UPDATE_NOT_AVAILABLE flags that no update exists', () => {
    const next = reducer({ ...prev, checkingForUpdate: true }, { type: 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE' })
    expect(next.updateNotAvailable).toBe(true)
    expect(next.checkingForUpdate).toBe(false)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'AUTO_UPDATE/UPDATE_AVAILABLE' })).not.toBe(prev)
    const available = reducer(prev, { type: 'AUTO_UPDATE/UPDATE_AVAILABLE' })
    expect(reducer(available, { type: 'AUTO_UPDATE/UPDATE_AVAILABLE' })).toBe(available)
    expect(reducer(prev, { type: 'AUTO_UPDATE/CURRENT_VERSION', payload: { version: '1.1.0' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
