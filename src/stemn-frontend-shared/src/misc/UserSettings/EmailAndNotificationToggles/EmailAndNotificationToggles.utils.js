export const toggleData = {
  'own-user-follow': {
    name: 'New follower',
    description: 'When someone follows you',
  },
  'own-user-mention': {
    name: 'New mention',
    description: 'When someone mentions you.',
  },
  'added-to-project': {
    name: 'Project invites',
    description: 'When someone adds you to a project.',
  },
  'own-project-thread': {
    name: 'Project threads',
    description: 'When someone creates a thread on your project.',
  },
  'own-project-mention': {
    name: 'Project mentions',
    description: 'When someone mentions your project.',
  },
  'own-project-cloned': {
    name: 'Project clones',
    description: 'When someone clones your project.',
  },
  'assigned-thread': {
    name: 'Assigned thread',
    description: 'When someone assigns you to a thread.',
  },
  'own-thread-mention': {
    name: 'Thread mentions',
    description: 'When someone mentions your thread.',
  },
  'own-thread-comment': {
    name: 'Thread comments',
    description: 'When someone comments on your thread.',
  },
  'own-thread-closed': {
    name: 'Thread closed',
    description: 'When someone marks your thread as closed.',
  },
  'followed-thread-comment': {
    name: 'Followed thread comments',
    description: 'When someone comments on a thread you follow.',
  },
  'followed-thread-closed': {
    name: 'Followed thread closed',
    description: 'When someone marks a thread you follow as closed.',
  },
  product: {
    name: 'Product Updates',
    description: "We're proud of every new feature we add to STEMN, and when a new feature is ready for you, we want you to be the first to know.",
  },
}

export const getToggleData = name => toggleData[name]

const toggles = [{
  name: 'Follows',
  title: 'Follows',
  description: 'When others follow you.',
  toggles: [
    'own-user-follow',
  ],
}, {
  name: 'ProjectEvent',
  title: 'Your projects',
  description: "When there's activity on your projects.",
  toggles: [
    'added-to-project',
    'own-project-thread',
    'own-project-cloned',
  ],
}, {
  name: 'ThreadEvent',
  title: 'Your threads',
  description: "When there's activity on your threads.",
  toggles: [
    'assigned-thread',
    'own-thread-comment',
    'own-thread-closed',
  ],
}, {
  name: 'FollowedThreadEvent',
  title: 'Threads you follow',
  description: "When there's activity on a thread you follow.",
  toggles: [
    'followed-thread-comment',
    'followed-thread-closed',
  ],
}, {
  name: 'Mentions',
  title: 'Mentions',
  description: 'When others mention you or your creations.',
  toggles: [
    'own-user-mention',
    'own-project-mention',
    'own-thread-mention',
  ],
}]

export const emailToggles = toggles
export const websiteToggles = toggles
