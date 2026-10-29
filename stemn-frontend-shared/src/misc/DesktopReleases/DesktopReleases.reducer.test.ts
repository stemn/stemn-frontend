import { describe, expect, it } from 'vitest'
import reducer from './DesktopReleases.reducer'

const assets = [
  { name: 'Stemn-Setup-1.2.0.exe', browser_download_url: 'https://example.com/win' },
  { name: 'Stemn-1.2.0.AppImage', browser_download_url: 'https://example.com/linux' },
  { name: 'Stemn-1.2.0.dmg', browser_download_url: 'https://example.com/mac' },
]

describe('DesktopReleases reducer', () => {
  const prev = { latest: { version: '', windows: {}, linux: {}, mac: {} }, other: { x: 1 } }

  it('DESKTOP_RELEASES/GET_LATEST_FULFILLED stores the release assets per platform', () => {
    const next = reducer(prev, {
      type: 'DESKTOP_RELEASES/GET_LATEST_FULFILLED',
      payload: { data: { name: 'v1.2.0', assets } },
    })
    expect(next.latest).toEqual({ version: 'v1.2.0', windows: assets[0], linux: assets[1], mac: assets[2] })
    expect(next.latest.windows).toBe(assets[0])
    expect(next.other).toBe(prev.other)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
