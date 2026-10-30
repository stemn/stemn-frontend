/**
 * Main-process auto-update controller around electron-updater's autoUpdater.
 *
 * Dependencies are injected (no Electron imports here) so that the policy is unit-tested with a fake
 * autoUpdater (tests/unit/updater.test.ts); app/main/updater/index.js wires the real ones.
 *
 *  - channel: the `system.settings.updateChannel` setting ('stable' | 'beta'), defaulting to the
 *    channel of the running version; re-applied whenever the setting changes
 *  - stable downloads in the background (autoDownload), beta asks first; never downgrades;
 *    a downloaded update is installed on the next quit (autoInstallOnAppQuit) or by
 *    "Restart to update" (quitAndInstall)
 *  - quitAndInstall is refused while a commit is in flight
 *  - automatic checks (on start and every `checkIntervalMs`) only when `system.settings.autoUpdate`
 *    is on; manual checks always work
 *  - every event is logged as one structured line: `[updater] {"event":"...",...}`
 */
import {
  checking,
  configured,
  currentVersion as currentVersionAction,
  downloadProgress,
  installRefused,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable,
} from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.actions.js'
import { channelPolicy, feedOptions, releaseNotesText, selectChannel } from './feed.js'
import { createCommitGuard } from './guard.js'

export const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000

export const REFUSAL_MESSAGES = {
  'commit-in-progress': 'A commit is still being saved. Stemn will be able to restart once it has finished.',
  'no-update': 'No update has been downloaded yet.',
  unsupported: 'This copy of Stemn cannot update itself.',
}

/**
 * @param {object} deps
 * @param {import('electron-updater').AppUpdater} deps.autoUpdater
 * @param {{ getState: () => any, dispatch: (action: any) => any, subscribe: (listener: () => void) => () => void }} deps.store
 * @param {{ edition: string, provider: string }} deps.feed build-time feed (GLOBAL_ENV.UPDATE_FEED)
 * @param {string} deps.currentVersion
 * @param {string} deps.platform process.platform
 * @param {() => { supported: boolean, reason?: string }} deps.isSupported can this install update itself
 * @param {string} [deps.overrideUrl] STEMN_UPDATES_URL (generic feed base url for tests / QA)
 * @param {(event: string, fields?: object) => void} deps.logEvent
 * @param {(callback: () => void, ms: number) => any} [deps.setInterval]
 * @param {() => number} [deps.now]
 * @param {number} [deps.checkIntervalMs]
 */
export const createUpdater = ({
  autoUpdater,
  store,
  feed,
  currentVersion,
  platform,
  isSupported,
  overrideUrl,
  logEvent,
  setInterval: schedule = setInterval,
  now = Date.now,
  checkIntervalMs = CHECK_INTERVAL_MS,
}) => {
  const guard = createCommitGuard({ now })
  let config = null
  let available = null
  let downloaded = null
  let downloading = false
  let lastProgress = -1
  let timer = null
  let started = false

  const settings = () => store.getState().system.settings || {}
  const currentChannel = () => selectChannel({ setting: settings().updateChannel, currentVersion })

  const dispatchDownloaded = (info) =>
    store.dispatch(
      updateDownloaded({
        update: info.downloadedFile,
        version: info.version,
        platform,
        readme: releaseNotesText(info.releaseNotes),
      }),
    )

  const status = () => ({
    currentVersion,
    channel: config ? config.channel : currentChannel(),
    edition: feed.edition,
    provider: config ? config.options.provider : feed.provider,
    supported: isSupported().supported,
    available: available ? { version: available.version } : null,
    downloaded: downloaded ? { version: downloaded.version } : null,
    downloading,
    pendingCommits: guard.pendingCommits(store.getState()),
  })

  /** Point autoUpdater at the feed of `channel` and apply its policy */
  const configure = (channel = currentChannel()) => {
    const options = feedOptions({ feed, channel, overrideUrl })
    const policy = channelPolicy(channel)
    autoUpdater.setFeedURL(options)
    autoUpdater.autoDownload = policy.autoDownload
    autoUpdater.allowPrerelease = policy.allowPrerelease
    // after setFeedURL: setting a channel on electron-updater turns allowDowngrade on
    autoUpdater.allowDowngrade = policy.allowDowngrade
    autoUpdater.autoInstallOnAppQuit = policy.autoInstallOnAppQuit
    config = { channel, options, policy }
    const { channel: channelFile, ...provider } = options
    logEvent('configured', {
      channel,
      edition: feed.edition,
      ...provider,
      channelFile,
      autoDownload: policy.autoDownload,
    })
    store.dispatch(configured({ channel, edition: feed.edition, provider: options.provider }))
    return config
  }

  /** Check the feed. `manual`: started by the user (tray, settings, banner). */
  const check = async ({ manual = false } = {}) => {
    const support = isSupported()
    if (!support.supported) {
      logEvent('check-skipped', { manual, reason: support.reason })
      store.dispatch(updateNotAvailable())
      return status()
    }
    if (downloaded) {
      // Already downloaded: nothing to fetch until the app restarts (the legacy aliased
      // AUTO_UPDATE/CHECK_FOR_UPDATES action resets the flags in the store: restore them)
      logEvent('check-skipped', { manual, reason: 'already-downloaded', version: downloaded.version })
      setImmediate(() => dispatchDownloaded(downloaded))
      return status()
    }
    if (!config) configure()
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      // reported through the 'error' event
    }
    return status()
  }

  const download = async () => {
    if (downloaded || downloading || !available) return status()
    downloading = true
    logEvent('download-started', { version: available.version, manual: true })
    try {
      await autoUpdater.downloadUpdate()
    } catch (error) {
      // reported through the 'error' event
    } finally {
      downloading = false
    }
    return status()
  }

  /** Restart to install the downloaded update, unless a commit is in flight */
  const quitAndInstall = () => {
    const refuse = (reason, fields = {}) => {
      const message = REFUSAL_MESSAGES[reason]
      logEvent('install-refused', { reason, ...fields })
      store.dispatch(installRefused({ reason, message }))
      return { ok: false, reason, message }
    }
    if (!isSupported().supported) return refuse('unsupported')
    if (!downloaded) return refuse('no-update')
    const pending = guard.pendingCommits(store.getState())
    if (pending.length > 0) return refuse('commit-in-progress', { projects: pending })
    const stale = guard.staleCommits(store.getState())
    if (stale.length > 0) logEvent('stale-commit-ignored', { projects: stale })

    logEvent('install', { version: downloaded.version })
    // Let the IPC reply go out before the app quits
    setImmediate(() => autoUpdater.quitAndInstall(false, true))
    return { ok: true }
  }

  const wireEvents = () => {
    autoUpdater.on('checking-for-update', () => {
      logEvent('checking', { channel: config && config.channel })
      store.dispatch(checking())
    })
    autoUpdater.on('update-available', (info) => {
      available = info
      lastProgress = -1
      if (config && config.policy.autoDownload) downloading = true
      logEvent('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        autoDownload: !!(config && config.policy.autoDownload),
      })
      store.dispatch(
        updateAvailable({
          version: info.version,
          releaseNotes: releaseNotesText(info.releaseNotes),
          releaseDate: info.releaseDate,
          autoDownload: !!(config && config.policy.autoDownload),
        }),
      )
    })
    autoUpdater.on('update-not-available', (info) => {
      logEvent('update-not-available', { latest: info && info.version })
      store.dispatch(updateNotAvailable())
    })
    autoUpdater.on('download-progress', (progress) => {
      const percent = Math.floor(progress.percent || 0)
      // a few progress actions per download, not one per chunk
      if (percent >= lastProgress + 5 || percent === 100) {
        lastProgress = percent
        store.dispatch(downloadProgress({ percent }))
      }
    })
    autoUpdater.on('update-downloaded', (info) => {
      downloaded = info
      downloading = false
      logEvent('update-downloaded', { version: info.version, file: info.downloadedFile })
      dispatchDownloaded(info)
    })
    autoUpdater.on('error', (error) => {
      downloading = false
      logEvent('error', { message: error && error.message, code: error && error.code })
      store.dispatch(updateError(error))
    })
  }

  /** Re-apply the feed when the channel setting changes, (un)schedule checks with the autoUpdate setting */
  const watchSettings = () => {
    let previous = { channel: currentChannel(), autoUpdate: settings().autoUpdate }
    store.subscribe(() => {
      const state = store.getState()
      guard.observe(state)
      const next = { channel: currentChannel(), autoUpdate: settings().autoUpdate }
      const before = previous
      // update first: configure() and check() dispatch, which re-enters this listener
      previous = next
      if (next.channel !== before.channel) {
        logEvent('channel-changed', { from: before.channel, to: next.channel })
        configure(next.channel)
        if (!downloaded) {
          available = null
          check({ manual: false })
        }
      }
      if (next.autoUpdate !== before.autoUpdate) {
        logEvent('auto-update-setting', { enabled: next.autoUpdate !== false })
        if (next.autoUpdate !== false) check({ manual: false })
      }
    })
  }

  /** Configure, wire the events, check (when auto-update is on) and schedule the periodic checks */
  const start = () => {
    if (started) return
    started = true
    store.dispatch(currentVersionAction({ version: currentVersion }))
    wireEvents()
    configure()
    watchSettings()
    const support = isSupported()
    logEvent('started', {
      version: currentVersion,
      platform,
      supported: support.supported,
      reason: support.reason,
      autoUpdate: settings().autoUpdate !== false,
    })
    const autoCheck = () => {
      if (settings().autoUpdate !== false) check({ manual: false })
    }
    autoCheck()
    timer = schedule(autoCheck, checkIntervalMs)
    if (timer && typeof timer.unref === 'function') timer.unref()
  }

  return {
    start,
    configure,
    check,
    download,
    quitAndInstall,
    status,
    /** FunctionLibrary aliases (AutoUpdate.actions.js: checkForUpdates / downloadUpdate / installUpdate) */
    functions: {
      checkForUpdates: () => {
        check({ manual: true })
        return ''
      },
      downloadUpdate: () => {
        download()
        return ''
      },
      installUpdates: () => {
        quitAndInstall()
        return ''
      },
    },
  }
}
