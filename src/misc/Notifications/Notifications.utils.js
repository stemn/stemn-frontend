export const show = (options) => {
  // https://github.com/hokein/electron-sample-apps/blob/master/notifications/window.js
  new Notification(options.title, options)
}

const notificationText = {
  'added-project'                      : 'added you to their project',
  'added-organisation'                 : 'added you to the organisation',
  'invite-accepted'                    : 'joined',
  'followed-user-project'              : 'has a new project',
  'followed-user-blog'                 : 'has a new blog',
  'followed-user-general'              : 'has a new discussion',
  'followed-user-question'             : 'has a new question',
  'followed-project-blog'              : 'has a new blog',
  'followed-project-general'           : 'has a new discussion',
  'followed-project-question'          : 'has a new question',
  'followed-project-post'              : 'commented',
  'followed-field-project'             : 'has a new project',
  'followed-field-blog'                : 'has a new blog',
  'followed-field-general'             : 'has a new discussion',
  'followed-organisation-project'      : 'has a new project',
  'followed-field-question'            : 'has a new question',
  'followed-organisation-blog'         : 'has a new blog',
  'followed-organisation-general'      : 'has a new discussion',
  'followed-organisation-question'     : 'has a new question',
  'followed-own-user'                  : 'is now following you.',
  'followed-own-project'               : 'is now following your project',
  'followed-own-question'              : 'is now following your question',
  'followed-own-blog'                  : 'is now following your blog',
  'followed-own-general'               : 'is now following your discussion',
  'followed-own-organisation'          : 'is now following your organisation',
  'followed-question-post'             : 'posted an answer in',
  'followed-blog-post'                 : 'posted a comment on',
  'followed-general-post'              : 'posted a reply in',
  'own-question-post'                  : 'answered your question',
  'own-blog-post'                      : 'posted on your blog',
  'own-general-post'                   : 'replied in your discussion',
  'own-question-like'                  : 'liked your question',
  'own-blog-like'                      : 'liked your blog',
  'own-general-like'                   : 'liked your discussion',
  'own-post-like'                      : 'liked your post',
  'own-post-post'                      : 'replied to your post',
  'own-user-mention'                   : 'mentioned you in',
  'own-project-mention'                : 'mentioned your project in',
  'own-organisation-mention'           : 'mentioned your organisation in',
  'own-blog-mention'                   : 'mentioned your blog in',
  'own-general-mention'                : 'mentioned your discussion in',
  'own-question-mention'               : 'mentioned your question in',
  'own-application-pendingReview'      : 'application is now pending review.',
  'own-application-underReview'        : 'application is now under review.',
  'own-application-awaitingUpdate'     : 'application is awaiting update.',
  'own-application-readyToSubmit'      : 'application is now submitted.',
  'own-application-submittedToCompany' : 'application has been rejected.',
  'own-application-rejected'           : 'application has been rejected.',
  'own-application-processLater'       : 'application is now submitted.',
}

export const getNotificationText = (notificationType) => {
  if (notificationText[notificationType]) {
    return notificationText[notificationType]
  } else {
    console.error(`Notification of type ${notificationType} could not be found`);
  }
}
