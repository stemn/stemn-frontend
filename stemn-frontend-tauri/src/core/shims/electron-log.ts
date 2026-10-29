/**
 * `electron-log/main` for the core window: the main-process modules that are reused unchanged log
 * through it. Messages go to tauri-plugin-log, i.e. the same `main.log` as the Rust side.
 */
import { debug as logDebug, error as logError, info as logInfo, warn as logWarn } from '@tauri-apps/plugin-log'

const format = (args: unknown[]) =>
  args
    .map((arg) => {
      if (typeof arg === 'string') return arg
      if (arg instanceof Error) return arg.stack || arg.message
      try {
        return JSON.stringify(arg)
      } catch {
        return String(arg)
      }
    })
    .join(' ')

const send =
  (fn: (message: string) => Promise<void>, consoleFn: (...args: unknown[]) => void) =>
  (...args: unknown[]) => {
    consoleFn(...args)
    fn(format(args)).catch(() => {})
  }

const log = {
  info: send(logInfo, console.info),
  warn: send(logWarn, console.warn),
  error: send(logError, console.error),
  debug: send(logDebug, console.debug),
  verbose: send(logDebug, console.debug),
  silly: send(logDebug, console.debug),
  log: send(logInfo, console.log),
  initialize: () => {},
  transports: {},
}

export default log
