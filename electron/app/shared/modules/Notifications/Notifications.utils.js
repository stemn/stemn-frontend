export const show = (options) => {
  // https://github.com/hokein/electron-sample-apps/blob/master/notifications/window.js
  new Notification(options.title, options)
}
