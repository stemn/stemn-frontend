import { init as shellContextInit } from './ShellContext.js'

const shellContext = shellContextInit({
  folders: [
    //    `C:\\NVIDIA`,
    //    `E:\\Google Drive`
  ],
  title: 'View revisions in Stemn',
  appName: 'Stemn',
  // If we are in development, we add the path of the electron app to the shell command
  // This is because the execPath is the path to electron, not to the app.
  appPath: GLOBAL_ENV.NODE_ENV === 'development' ? `${process.execPath} ${process.cwd()}` : process.execPath,
})

export const enable       = () => shellContext.enable()
export const disable      = () => shellContext.disable()
export const isEnabled    = () => shellContext.isEnabled()
export const updateConfig = config => shellContext.updateConfig(config)
