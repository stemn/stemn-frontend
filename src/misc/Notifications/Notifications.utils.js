export const show = (options) => {
  // https://github.com/hokein/electron-sample-apps/blob/master/notifications/window.js
  new Notification(options.title, options)
}

const notificationText = {
  'own-user-follow': 'followed you',
  'own-user-mention': 'mentioned you',
  'added-to-project': 'added you to',
  'own-project-thread': 'created',
  'own-project-mention': 'mentioned',
  'own-project-cloned': 'cloned',
  'assigned-thread': 'assigned you to',
  'own-thread-mention': 'mentioned',
  'own-thread-comment': 'commented on',
  'own-thread-closed': 'closed',
  'followed-thread-comment': 'commented on',
  'followed-thread-closed': 'closed',
}

export const getNotificationText = (notificationType) => {
  if (notificationText[notificationType]) {
    return notificationText[notificationType]
  } 
  console.error(`Notification of type ${notificationType} could not be found`)
}
