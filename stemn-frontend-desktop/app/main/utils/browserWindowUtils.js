export const bindBackForward = (browserWindow) => {
  browserWindow.on('app-command', (e, cmd) => {
    // Navigate the window back/forward when the user hits their mouse back button
    // This will only work on Windows?
    if (cmd === 'browser-backward' && browserWindow.webContents.canGoBack()) {
      browserWindow.webContents.goBack()
    } else if (cmd === 'browser-forward' && browserWindow.webContents.canGoForward()) {
      browserWindow.webContents.goForward()
    }
  })
}
