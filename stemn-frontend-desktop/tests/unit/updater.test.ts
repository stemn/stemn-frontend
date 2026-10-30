/**
 * Unit tests of the main-process updater policy (app/main/updater): feed and channel selection,
 * the electron-updater flags, the store wiring and the "no install during a commit" guard.
 * A fake autoUpdater stands in for electron-updater; the store uses the real reducers.
 */
import { EventEmitter } from 'node:events'
import { combineReducers, legacy_createStore as createStore } from 'redux'
import { describe, expect, it, vi } from 'vitest'
import autoUpdate from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.reducer.js'
import system from 'stemn-shared/desktop/System/System.reducer.js'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions.js'
import storeReducer from 'stemn-shared/misc/Store/Store.reducer.js'
import { createUpdater } from '../../app/main/updater/core.js'
import { channelPolicy, feedOptions, releaseNotesText, selectChannel } from '../../app/main/updater/feed.js'
import { COMMIT_STALE_AFTER_MS, createCommitGuard } from '../../app/main/updater/guard.js'
import updateFeed from '../../config/updateFeed.cjs'

const { resolveUpdateFeed, builderPublishConfig } = updateFeed

class FakeAutoUpdater extends EventEmitter {
  autoDownload = true
  allowPrerelease = false
  allowDowngrade = false
  autoInstallOnAppQuit = false
  feed: any = null
  setFeedURL = vi.fn((options: any) => {
    this.feed = options
    // like electron-updater: a channel turns allowDowngrade on
    if (options.channel) this.allowDowngrade = true
  })
  checkForUpdates = vi.fn(async () => null)
  downloadUpdate = vi.fn(async () => [])
  quitAndInstall = vi.fn()
}

const makeStore = (settings: Record<string, unknown> = {}) => {
  const reducers = combineReducers({ autoUpdate, system } as any)
  const root = (state: any, action: any) =>
    action.type && action.type.startsWith('STORE/')
      ? reducers(storeReducer(state, action), action)
      : reducers(state, action)
  const store = createStore(root as any) as unknown as {
    getState: () => any
    dispatch: (action: any) => any
    subscribe: (listener: () => void) => () => void
  }
  Object.entries(settings).forEach(([key, value]) =>
    store.dispatch(storeChange(`system.settings.${key}`, value) as any),
  )
  return store
}

const setup = ({
  version = '1.2.0',
  settings = {},
  feed = { edition: 'eu', provider: 'generic', url: 'https://updates.stemn.eu/desktop' },
  supported = true,
  overrideUrl,
  now = () => 1_000_000,
}: any = {}) => {
  const autoUpdater = new FakeAutoUpdater()
  const store = makeStore(settings)
  const events: { event: string; fields: any }[] = []
  const updater = createUpdater({
    autoUpdater: autoUpdater as any,
    store,
    feed,
    currentVersion: version,
    platform: 'linux',
    isSupported: () => (supported ? { supported: true } : { supported: false, reason: 'not-packaged' }),
    overrideUrl,
    logEvent: (event: string, fields: any) => events.push({ event, fields }),
    setInterval: vi.fn(() => ({ unref() {} })) as any,
    now,
  })
  return { autoUpdater, store, updater, events }
}

const flush = () => new Promise((resolve) => setImmediate(resolve))

describe('update feed (config/updateFeed.cjs)', () => {
  it('global edition: GitHub releases of stemn/stemn-desktop until UPDATES_URL is set', () => {
    expect(resolveUpdateFeed({})).toEqual({
      edition: 'global',
      provider: 'github',
      owner: 'stemn',
      repo: 'stemn-desktop',
    })
    expect(resolveUpdateFeed({ UPDATES_URL: 'https://updates.stemn.com/desktop/' })).toEqual({
      edition: 'global',
      provider: 'generic',
      url: 'https://updates.stemn.com/desktop',
    })
  })

  it('EU edition: a generic feed on EU storage, never GitHub', () => {
    expect(resolveUpdateFeed({ STEMN_EDITION: 'eu' })).toEqual({
      edition: 'eu',
      provider: 'generic',
      url: 'https://updates.stemn.eu/desktop',
    })
    expect(builderPublishConfig(resolveUpdateFeed({ STEMN_EDITION: 'eu' }), 'beta')).toEqual([
      { provider: 'generic', url: 'https://updates.stemn.eu/desktop/beta/', channel: 'beta' },
    ])
  })

  it('rejects unknown editions and non-https feeds (http only for localhost)', () => {
    expect(() => resolveUpdateFeed({ STEMN_EDITION: 'us' })).toThrow(/Unknown STEMN_EDITION/)
    expect(() => resolveUpdateFeed({ UPDATES_URL: 'http://updates.stemn.com' })).toThrow(/https/)
    expect(resolveUpdateFeed({ UPDATES_URL: 'http://127.0.0.1:4000/feed' }).url).toBe('http://127.0.0.1:4000/feed')
  })
})

describe('channel selection', () => {
  it('follows the setting, or the channel of the running version', () => {
    expect(selectChannel({ setting: undefined, currentVersion: '1.2.0' })).toBe('stable')
    expect(selectChannel({ setting: null, currentVersion: '1.3.0-beta.2' })).toBe('beta')
    expect(selectChannel({ setting: 'beta', currentVersion: '1.2.0' })).toBe('beta')
    expect(selectChannel({ setting: 'stable', currentVersion: '1.3.0-beta.2' })).toBe('stable')
    expect(selectChannel({ setting: 'nightly', currentVersion: '1.2.0' })).toBe('stable')
  })

  it('maps a channel to its feed directory and channel file', () => {
    const feed = { provider: 'generic', url: 'https://updates.stemn.eu/desktop' }
    expect(feedOptions({ feed, channel: 'stable' })).toEqual({
      provider: 'generic',
      url: 'https://updates.stemn.eu/desktop/stable/',
      channel: 'latest',
    })
    expect(feedOptions({ feed, channel: 'beta' })).toEqual({
      provider: 'generic',
      url: 'https://updates.stemn.eu/desktop/beta/',
      channel: 'beta',
    })
    expect(
      feedOptions({ feed: { provider: 'github', owner: 'stemn', repo: 'stemn-desktop' }, channel: 'beta' }),
    ).toEqual({
      provider: 'github',
      owner: 'stemn',
      repo: 'stemn-desktop',
    })
    expect(feedOptions({ feed, channel: 'stable', overrideUrl: 'http://127.0.0.1:9999/feed' }).url).toBe(
      'http://127.0.0.1:9999/feed/stable/',
    )
  })

  it('stable downloads automatically, beta asks; neither downgrades', () => {
    expect(channelPolicy('stable')).toEqual({
      autoDownload: true,
      allowPrerelease: false,
      allowDowngrade: false,
      autoInstallOnAppQuit: true,
    })
    expect(channelPolicy('beta')).toMatchObject({ autoDownload: false, allowPrerelease: true, allowDowngrade: false })
  })

  it('normalises release notes from the generic feed (string) and GitHub (list)', () => {
    expect(releaseNotesText('- Fix')).toBe('- Fix')
    expect(
      releaseNotesText([
        { version: '1.2.0', note: 'B' },
        { version: '1.1.0', note: null },
      ]),
    ).toBe('## 1.2.0\n\nB')
    expect(releaseNotesText(null)).toBe('')
  })
})

describe('updater', () => {
  it('configures the feed of the selected channel and checks on start when auto-update is on', async () => {
    const { autoUpdater, store, updater, events } = setup()
    updater.start()
    expect(autoUpdater.feed).toEqual({
      provider: 'generic',
      url: 'https://updates.stemn.eu/desktop/stable/',
      channel: 'latest',
    })
    expect(autoUpdater.autoDownload).toBe(true)
    expect(autoUpdater.autoInstallOnAppQuit).toBe(true)
    // reset after setFeedURL turned it on
    expect(autoUpdater.allowDowngrade).toBe(false)
    expect(autoUpdater.checkForUpdates).toHaveBeenCalledTimes(1)
    expect(store.getState().autoUpdate).toMatchObject({ currentVersion: '1.2.0', channel: 'stable', edition: 'eu' })
    expect(events.map((entry) => entry.event)).toEqual(['configured', 'started'])
  })

  it('does not check automatically when auto-update is off, but manual checks work', async () => {
    const { autoUpdater, updater } = setup({ settings: { autoUpdate: false } })
    updater.start()
    expect(autoUpdater.checkForUpdates).not.toHaveBeenCalled()
    await updater.check({ manual: true })
    expect(autoUpdater.checkForUpdates).toHaveBeenCalledTimes(1)
  })

  it('switching to beta re-points the feed, stops auto-download and checks again', () => {
    const { autoUpdater, store, updater, events } = setup()
    updater.start()
    store.dispatch(storeChange('system.settings.updateChannel', 'beta') as any)
    expect(autoUpdater.feed).toEqual({
      provider: 'generic',
      url: 'https://updates.stemn.eu/desktop/beta/',
      channel: 'beta',
    })
    expect(autoUpdater.autoDownload).toBe(false)
    expect(autoUpdater.allowPrerelease).toBe(true)
    expect(autoUpdater.allowDowngrade).toBe(false)
    expect(autoUpdater.checkForUpdates).toHaveBeenCalledTimes(2)
    expect(store.getState().autoUpdate.channel).toBe('beta')
    expect(events.find((entry) => entry.event === 'channel-changed')!.fields).toEqual({ from: 'stable', to: 'beta' })
  })

  it('a beta build follows beta by default', () => {
    const { autoUpdater, updater } = setup({ version: '1.3.0-beta.1' })
    updater.start()
    expect(autoUpdater.feed.channel).toBe('beta')
  })

  it('reports update-available -> update-downloaded in the store', () => {
    const { autoUpdater, store, updater } = setup()
    updater.start()
    autoUpdater.emit('checking-for-update')
    expect(store.getState().autoUpdate.checkingForUpdate).toBe(true)
    autoUpdater.emit('update-available', { version: '1.3.0', releaseNotes: '- New', releaseDate: '2026-11-01' })
    expect(store.getState().autoUpdate).toMatchObject({
      updateAvailable: true,
      checkingForUpdate: false,
      available: { version: '1.3.0', releaseNotes: '- New', autoDownload: true },
    })
    autoUpdater.emit('download-progress', { percent: 42.5 })
    expect(store.getState().autoUpdate.progress).toBe(42)
    autoUpdater.emit('update-downloaded', { version: '1.3.0', releaseNotes: '- New', downloadedFile: '/tmp/x' })
    expect(store.getState().autoUpdate).toMatchObject({
      updateDownloaded: true,
      progress: null,
      release: { version: '1.3.0', readme: '- New', platform: 'linux' },
    })
    expect(updater.status()).toMatchObject({ downloaded: { version: '1.3.0' }, channel: 'stable' })
  })

  it('does not re-check once an update is downloaded (and restores the downloaded state)', async () => {
    const { autoUpdater, store, updater } = setup()
    updater.start()
    autoUpdater.emit('update-downloaded', { version: '1.3.0', downloadedFile: '/tmp/x' })
    store.dispatch({ type: 'AUTO_UPDATE/CHECK_FOR_UPDATES', payload: '' })
    await updater.check({ manual: true })
    await flush()
    expect(autoUpdater.checkForUpdates).toHaveBeenCalledTimes(1)
    expect(store.getState().autoUpdate.updateDownloaded).toBe(true)
  })

  it('reports errors', () => {
    const { autoUpdater, store, updater, events } = setup()
    updater.start()
    autoUpdater.emit('error', Object.assign(new Error('net::ERR_CONNECTION_REFUSED'), { code: 'ERR' }))
    expect(store.getState().autoUpdate.updateError).toBe('net::ERR_CONNECTION_REFUSED')
    expect(events.at(-1)).toEqual({ event: 'error', fields: { message: 'net::ERR_CONNECTION_REFUSED', code: 'ERR' } })
  })

  it('does nothing on copies that cannot update themselves', async () => {
    const { autoUpdater, store, updater } = setup({ supported: false })
    updater.start()
    expect(autoUpdater.checkForUpdates).not.toHaveBeenCalled()
    expect(store.getState().autoUpdate.updateNotAvailable).toBe(true)
    expect(updater.quitAndInstall()).toMatchObject({ ok: false, reason: 'unsupported' })
  })
})

describe('quitAndInstall: never while a commit is in flight', () => {
  const downloaded = (options: any = {}) => {
    const context = setup(options)
    context.updater.start()
    context.autoUpdater.emit('update-downloaded', { version: '1.3.0', downloadedFile: '/tmp/x' })
    return context
  }
  const commit = (type: string, projectId = 'p1') => ({ type: `CHANGES/COMMIT_${type}`, meta: { cacheKey: projectId } })

  it('is refused before an update is downloaded', () => {
    const { updater, autoUpdater } = setup()
    updater.start()
    expect(updater.quitAndInstall()).toMatchObject({ ok: false, reason: 'no-update' })
    expect(autoUpdater.quitAndInstall).not.toHaveBeenCalled()
  })

  it('is refused while a commit is pending, and allowed once it has finished', async () => {
    const { updater, autoUpdater, store, events } = downloaded()
    store.dispatch(commit('PENDING'))
    expect(store.getState().autoUpdate.pendingCommits).toEqual({ p1: true })
    expect(updater.status().pendingCommits).toEqual(['p1'])

    const refused = updater.quitAndInstall()
    expect(refused).toEqual({ ok: false, reason: 'commit-in-progress', message: expect.stringMatching(/commit/) })
    await flush()
    expect(autoUpdater.quitAndInstall).not.toHaveBeenCalled()
    expect(store.getState().autoUpdate.installRefused).toMatchObject({ reason: 'commit-in-progress' })
    expect(events.find((entry) => entry.event === 'install-refused')!.fields).toEqual({
      reason: 'commit-in-progress',
      projects: ['p1'],
    })

    store.dispatch(commit('FULFILLED'))
    expect(store.getState().autoUpdate.pendingCommits).toEqual({})
    expect(store.getState().autoUpdate.installRefused).toBe(null)
    expect(updater.quitAndInstall()).toEqual({ ok: true })
    await flush()
    expect(autoUpdater.quitAndInstall).toHaveBeenCalledWith(false, true)
  })

  it('a rejected commit also releases the guard', () => {
    const { updater, store } = downloaded()
    store.dispatch(commit('PENDING', 'a'))
    store.dispatch(commit('PENDING', 'b'))
    store.dispatch(commit('REJECTED', 'a'))
    expect(updater.quitAndInstall()).toMatchObject({ ok: false, reason: 'commit-in-progress' })
    store.dispatch(commit('FULFILLED', 'b'))
    expect(updater.quitAndInstall()).toEqual({ ok: true })
  })

  it('a commit stuck for longer than the stale timeout no longer blocks the update', () => {
    let time = 0
    const { updater, store, events } = downloaded({ now: () => time })
    store.dispatch(commit('PENDING'))
    time = COMMIT_STALE_AFTER_MS - 1
    expect(updater.quitAndInstall()).toMatchObject({ ok: false })
    time = COMMIT_STALE_AFTER_MS + 1
    expect(updater.quitAndInstall()).toEqual({ ok: true })
    expect(events.find((entry) => entry.event === 'stale-commit-ignored')!.fields).toEqual({ projects: ['p1'] })
  })
})

describe('commit guard', () => {
  it('tracks when each pending commit was first seen', () => {
    let time = 10
    const guard = createCommitGuard({ now: () => time, staleAfterMs: 100 })
    const state = (pendingCommits: any) => ({ autoUpdate: { pendingCommits } })
    expect(guard.pendingCommits(state({}))).toEqual([])
    expect(guard.pendingCommits(state({ p1: true }))).toEqual(['p1'])
    time = 60
    expect(guard.pendingCommits(state({ p1: true, p2: true }))).toEqual(['p1', 'p2'])
    time = 115
    expect(guard.pendingCommits(state({ p1: true, p2: true }))).toEqual(['p2'])
    expect(guard.staleCommits(state({ p1: true, p2: true }))).toEqual(['p1'])
    expect(guard.pendingCommits(state({}))).toEqual([])
  })
})
