/**
 * IPC channels between the main process and the renderers.
 * The renderers only reach these through the preload bridge (window.stemnDesktop),
 * see app/preload/index.ts and app/main/ipc.js.
 */
export const IPC = {
  /** invoke: () => { state, windowName } - the main store state for a new window */
  GET_INITIAL_STATE: 'stemn:get-initial-state',
  /** renderer -> main (send): a redux action for the main store.
   *  main -> renderer (send): an action to replay in the renderer store (meta.scope 'local') */
  REDUX_ACTION: 'stemn:redux-action',
  /** renderer -> main (send): { target, action } forward an action to another window ('main' | 'menubar' | 'preview') */
  FORWARD_TO_WINDOW: 'stemn:forward-to-window',
  /** invoke: { command: 'minimize' | 'toggleMaximize' | 'close' | 'isMaximized' } for the sender's window */
  WINDOW_COMMAND: 'stemn:window-command',
  /** invoke: { title, defaultPath, buttonLabel } => string | null (native folder picker) */
  SELECT_DIRECTORY: 'stemn:select-directory',
  /** invoke: url => void (http, https and mailto only) */
  OPEN_EXTERNAL: 'stemn:open-external',
  /** invoke: path => error string ('' on success) */
  OPEN_PATH: 'stemn:open-path',
  /** invoke: path => boolean (false if the path does not exist) */
  SHOW_ITEM_IN_FOLDER: 'stemn:show-item-in-folder',
  /** send: { level, message } renderer errors/warnings for the main log */
  LOG: 'stemn:log',
  /** invoke: () => UpdateStatus (see app/preload/types.ts) */
  UPDATES_STATUS: 'stemn:updates-status',
  /** invoke: () => UpdateStatus - check the update feed now */
  UPDATES_CHECK: 'stemn:updates-check',
  /** invoke: () => UpdateStatus - download an available update (beta: not downloaded automatically) */
  UPDATES_DOWNLOAD: 'stemn:updates-download',
  /** invoke: () => { ok, reason?, message? } - restart and install; refused while a commit is in flight */
  UPDATES_QUIT_AND_INSTALL: 'stemn:updates-quit-and-install',
}

/** Window names used for action scopes (`meta.scope: ['main']`) */
export const WINDOW_NAMES = ['main', 'menubar', 'preview']
