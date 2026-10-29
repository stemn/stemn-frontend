/** Set by the Rust initialization script of every window (src-tauri/src/windows.rs `init_script`) */
export interface StemnTauriInfo {
  label: string
  windowName: 'main' | 'menubar' | 'preview' | 'core'
  platform: 'linux' | 'darwin' | 'win32'
  versions: { electron: string; chrome: string; node: string; tauri: string; webview: string }
  logRendererConsole: boolean
  logWebsocket: boolean
}

/** core -> renderer messages (event `stemn:to-renderer`) */
export type ToRenderer =
  | { kind: 'action'; seq: number; session: string; action: any; target?: 'main' | 'menubar' | 'preview' }
  | { kind: 'initial-state'; id: string; state: any; session: string; after: number }

/** renderer -> core messages (command `bridge_to_core`, event `stemn:to-core`; `from` is added by Rust) */
export type ToCore = { seq: number; session: string; from: string } & (
  | { kind: 'action'; action: any }
  | { kind: 'forward'; target: 'main' | 'menubar' | 'preview'; action: any }
  | { kind: 'get-initial-state'; id: string }
)

declare global {
  interface Window {
    __STEMN_TAURI__: StemnTauriInfo
  }
}
