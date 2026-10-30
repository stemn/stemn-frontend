/** State of the main-process updater (app/main/updater/core.js `status()`); null until it has started */
export interface IUpdateStatus {
  currentVersion: string
  channel: 'stable' | 'beta'
  edition: 'global' | 'eu'
  provider: 'generic' | 'github'
  /** false for unpackaged builds and the Linux .deb (only installed copies / the AppImage update themselves) */
  supported: boolean
  available: { version: string } | null
  downloaded: { version: string } | null
  downloading: boolean
  /** Project ids with a commit in flight: installing is refused until they finish */
  pendingCommits: string[]
}

export interface IInstallResult {
  ok: boolean
  reason?: 'commit-in-progress' | 'no-update' | 'unsupported' | 'not-running'
  message?: string
}

/** The API the preload script exposes to the renderers as `window.stemnDesktop` */
export interface IStemnDesktopBridge {
  /** process.platform of the host */
  platform:
    'aix' | 'android' | 'darwin' | 'freebsd' | 'haiku' | 'linux' | 'openbsd' | 'sunos' | 'win32' | 'cygwin' | 'netbsd'
  versions: { electron: string; chrome: string; node: string }
  /** Snapshot of the main-process redux state and the name of this window */
  getInitialState: () => Promise<{ state: any; windowName: 'main' | 'menubar' | 'preview' | undefined }>
  /** Send a redux action to the main-process store */
  dispatchToMain: (action: any) => void
  /** Send a redux action to another window's store */
  forwardToWindow: (target: 'main' | 'menubar' | 'preview', action: any) => void
  /** Subscribe to actions replayed by the main process. Returns an unsubscribe function. */
  onAction: (listener: (action: any) => void) => () => void
  window: {
    minimize: () => Promise<boolean>
    toggleMaximize: () => Promise<boolean>
    close: () => Promise<boolean>
    isMaximized: () => Promise<boolean>
  }
  dialog: {
    /** Native folder picker. Resolves with the folder path or null if cancelled. */
    selectDirectory: (options: { title?: string; defaultPath?: string; buttonLabel?: string }) => Promise<string | null>
  }
  shell: {
    openExternal: (url: string) => Promise<void>
    /** Resolves with an error message, or '' on success */
    openPath: (path: string) => Promise<string>
    /** Resolves false if the path does not exist */
    showItemInFolder: (path: string) => Promise<boolean>
  }
  log: (level: 'error' | 'warn', message: string) => void
  /** Auto-update. Progress and events arrive as AUTO_UPDATE/* actions in the store (state.autoUpdate). */
  updates: {
    getStatus: () => Promise<IUpdateStatus | null>
    checkForUpdates: () => Promise<IUpdateStatus | null>
    downloadUpdate: () => Promise<IUpdateStatus | null>
    /** Restarts into the downloaded update; refused ({ ok: false }) while a commit is in flight */
    quitAndInstall: () => Promise<IInstallResult>
  }
}

declare global {
  interface Window {
    stemnDesktop: IStemnDesktopBridge
  }
}
