import { init as shellContextInit } from './ShellContext.js';

const shellContext = shellContextInit({
  folders: [
    `C:\\NVIDIA`,
    `E:\\Google Drive`
  ],
  title: 'View revisions in Stemn',
  appName: 'Stemn',
  appPath: process.execPath
});

export const enable       = () => shellContext.enable();
export const disable      = () => shellContext.disable();
export const isEnabled    = () => shellContext.isEnabled();
export const updateConfig = (config) => shellContext.updateConfig(config);
