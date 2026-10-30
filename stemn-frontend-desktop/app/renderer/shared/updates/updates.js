/**
 * Renderer side of the auto-update: calls the main-process updater through the preload bridge
 * (`window.stemnDesktop.updates`). Its state arrives in the store as `state.autoUpdate`.
 */
import { getBridge } from 'stemn-shared/desktop/bridge'
import { show as showToast } from 'stemn-shared/misc/Toasts/Toasts.actions.js'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import releaseNotesModalName from 'stemn-shared/misc/Modal/ReleaseNotesModal'

export const checkForUpdates = () => getBridge().updates.checkForUpdates()

export const downloadUpdate = () => getBridge().updates.downloadUpdate()

/** Restart into the downloaded update. A refusal (commit in flight) is shown as a toast. */
export const restartToUpdate = () => async (dispatch) => {
  const result = await getBridge().updates.quitAndInstall()
  if (result && !result.ok && result.message) {
    dispatch(showToast({ title: result.message }))
  }
  return result
}

/** The release notes dialog: of the downloaded update (with "Restart to update") or of the installed version */
export const showReleaseNotes =
  ({ version, releaseNotes, downloaded = false } = {}) =>
  (dispatch) =>
    dispatch(
      showModal({
        modalType: releaseNotesModalName,
        modalProps: { version, releaseNotes, downloaded },
        limit: 1,
      }),
    )

/** "1.2.0" when an update is downloaded and waiting for a restart */
export const downloadedVersion = (autoUpdate) =>
  autoUpdate && autoUpdate.updateDownloaded && autoUpdate.release && autoUpdate.release.version
    ? autoUpdate.release.version
    : null

/** The channel being followed (same rule as app/main/updater/feed.js selectChannel) */
export const updateChannel = ({ autoUpdate, system }) => {
  const setting = system && system.settings && system.settings.updateChannel
  if (setting === 'stable' || setting === 'beta') return setting
  if (autoUpdate && autoUpdate.channel) return autoUpdate.channel
  return /^\d+\.\d+\.\d+-/.test(GLOBAL_ENV.APP_VERSION || '') ? 'beta' : 'stable'
}
