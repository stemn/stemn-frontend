export const toggleData = {
  'added-project': {
      name : 'Project invites',
      description : 'When someone adds you to a project.'
  },
  'added-organisation': {
      name : 'Organisation invites',
      description : 'When someone adds you to an organisation.'
  },
  'invite-accepted': {
      name : 'Project accept',
      description : 'When someone accepts your invite to a project.'
  },
  'followed-user-project': {
      name : 'Followed user projects',
      description : 'When someone you follow adds a new project.'
  },
  'followed-user-blog': {
      name : 'Followed user blogs',
      description : 'When someone you follow posts a blog.'
  },
  'followed-user-general': {
      name : 'Followed user discussions',
      description : 'When someone you follow starts a discussion.'
  },
  'followed-user-question': {
      name : 'Followed user questions',
      description : 'When someone you follow asks a question.'
  },
  'followed-project-blog': {
      name : 'Followed project blogs',
      description : 'When a blog is posted on a project you follow.'
  },
  'followed-project-general': {
      name : 'Followed project discussions',
      description : 'When a discussion is posted on a project you follow.'
  },
  'followed-project-question': {
      name : 'Followed project questions',
      description : 'When a question is asked on a project you follow.'
  },
  'followed-field-project': {
      name : 'Followed field projects',
      description : 'When a project is posted to a field you follow.'
  },
  'followed-field-blog': {
      name : 'Followed field blogs',
      description : 'When a blog is posted to a field you follow.'
  },
  'followed-field-general': {
      name : 'Followed field discussions',
      description : 'When a discussion is posted to a field you follow.'
  },
  'followed-field-question': {
      name : 'Followed field questions',
      description : 'When a question is asked on a field you follow.'
  },
  'followed-organisation-project': {
      name : 'Followed organisation projects',
      description : 'When a project is posted to an organisation you follow.'
  },
  'followed-organisation-blog': {
      name : 'Followed organisation blogs',
      description : 'When a blog is posted to an organisation you follow.'
  },
  'followed-organisation-general': {
      name : 'Followed organisation discussions',
      description : 'When a discussion is posted to an organisation you follow.'
  },
  'followed-organisation-question': {
      name : 'Followed Organisation question',
      description : 'When a question is asked an organisation you follow.'
  },
  'followed-own-user': {
      name : 'New follower',
      description : 'When someone follows you.'
  },
  'followed-own-project': {
      name : 'New project follower',
      description : 'When someone follows your project.'
  },
  'followed-own-question': {
      name : 'New question follower',
      description : 'When someone follows your question.'
  },
  'followed-own-blog': {
      name : 'New blog follower',
      description : 'When someone follows your blog.'
  },
  'followed-own-general': {
      name : 'New discussion follower',
      description : 'When someone follows your discussion.'
  },
  'followed-question-post': {
      name : 'Followed question answers',
      description : 'When someone answers a question you follow.'
  },
  'followed-blog-post': {
      name : 'Followed blog replies',
      description : 'When someone posts in a blog you follow.'
  },
  'followed-general-post': {
      name : 'Followed discussion replies',
      description : 'When someone posts in a discussion you follow.'
  },
  'followed-project-comment': { // TO BE UPDATED TO POSTS
      name : 'Followed project replies',
      description : 'When someone posts in a project you follow.'
  },
  'own-question-post': {
      name : 'Question replies',
      description : 'When someone answers your question.'
  },
  'own-blog-post': {
      name : 'Blog replies',
      description : 'When someone posts in your blog.'
  },
  'own-general-post': {
      name : 'Discussion replies',
      description : 'When someone posts in your discussion.'
  },
  'own-question-like': {
      name : 'Question likes',
      description : 'When someone likes your question.'
  },
  'own-blog-like': {
      name : 'Blog likes',
      description : 'When someone likes your blog.'
  },
  'own-general-like': {
      name : 'Discussion likes',
      description : 'When someone likes your discussion.'
  },
  'own-post-like': {
      name : 'Post likes',
      description : 'When someone likes your post.'
  },
  'own-post-post': {
      name : 'Post replies',
      description : 'When someone replies to your post.'
  },
  'own-project-comment': { // TO BE UPDATED TO POSTS
      name : 'Project comments',
      description : 'When someone posts in your project.'
  },
  'digest': {
      name : 'Weekly Digests',
      description : "Just once a week, you'll get a community-curated list of the best space projects."
  },
  'jobs': {
      name : 'Weekly Jobs Digests',
      description : "Just once a week, you'll get a personalised list of the latest space jobs based on the fields you follow."
  },
  'product': {
      name : 'Product Updates',
      description : "We're proud of every new feature we add to STEMN, and when a new feature is ready for you, we want you to be the first to know."
  },
  'own-user-mention': {
      name : 'Direct mentions',
      description : 'When someone mentions you.'
  },
  'own-project-mention': {
      name : 'Project mentions',
      description : 'When someone mentions your project.'
  },
  'own-organisation-mention': {
      name : 'Organisation mentions',
      description : 'When someone mentions your organisation.'
  },
  'own-thread-mention': {
      name : 'Blog, question, and discussion mentions',
      description : 'When someone mentions your blog, question, or discussion.'
  },
};

export const getToggleData = (name) => {
  return toggleData[name]
}

export const notificationToggles = [
    {
      name    : 'Invites',
      title   : 'Invites',
      description : 'When you are invited to projects.',
      toggles : [
        'added-project',
        'added-organisation',
      ]
    },{
      name    : 'FollowedUserProjectCreation',
      title   : 'People and Projects you follow',
      description : 'When something is posted by someone or a project you follow.',
      toggles : [
        'followed-user-project',
        'followed-user-blog',
        'followed-user-general',
        'followed-user-question',
        'followed-project-blog',
        'followed-project-general',
        'followed-project-question'
      ]
    },{
        name    : 'FollowedFieldOrgCreation',
        title   : 'Fields and Organisations you follow',
        description : 'When something is posted to a field or organisation you follow.',
        toggles : [
            'followed-field-project',
            'followed-field-blog',
            'followed-field-general',
            'followed-field-question',
            'followed-organisation-project',
            'followed-organisation-blog',
            'followed-organisation-general',
            'followed-organisation-question'
        ]
    },{
        name    : 'FollowedCreationPost',
        title   : 'Blogs, Questions and Discussion you follow',
        description : 'When someone posts on project, blog or thread you follow.',
        toggles : [
            'followed-question-post',
            'followed-blog-post',
            'followed-general-post',
            'followed-project-comment'
        ]
    },{
        name    : 'FollowedLikeOwnCreation',
        title   : 'Likes and Follows on your creations',
        description : 'When others like or follow you or your creations.',
        toggles : [
            'followed-own-user',
            'followed-own-project',
            'followed-own-blog',
            'followed-own-general',
            'followed-own-question',
            'own-question-like',
            'own-blog-like',
            'own-general-like',
            'own-post-like'
        ]
    },{
        name    : 'OwnCreationsPost',
        title   : 'Posts on your creations',
        description : 'When others reply to you or post on your creations.',
        toggles : [
            'own-question-post',
            'own-blog-post',
            'own-general-post',
            'own-project-comment',
            'own-post-post'
        ]
    },{
        name    : 'Mentions',
        title   : 'Mentions',
        description : 'When others mention you or your creations.',
        toggles : [
            'own-user-mention',
            'own-project-mention',
            'own-organisation-mention',
            'own-thread-mention'
        ]
    }
];

export const emailToggles = [
  // The name field is used to create anchor links
  // for example: stemn.com/settings/email#Invites will highlight the invite toggle
  {
    name    : 'News',
    title   : 'STEMN News',
    description : "Friendly emails including community-curated list of the best space projects, the latest STEMN features, and occasional VIP treatment (exclusive previews, invitations to events etc.)",
    toggles : [
      'digest',
      'jobs',
      'product'
    ]
  },{
    name    : 'Invites',
    title   : 'Invites',
    description : 'When you are invited to projects.',
    toggles : [
      'added-project',
      'added-organisation',
    ]
  },{
    name    : 'FollowedOwnCreation',
    title   : 'Follows on your creations',
    description : 'When others follow you or your creations.',
    toggles : [
      'followed-own-user',
      'followed-own-project',
      'followed-own-question',
      'followed-own-blog',
      'followed-own-general',
    ]
  },{
      name    : 'FollowedUserProjectCreation',
      title   : 'People and Projects you follow',
      description : 'When something is posted by someone or a project you follow.',
      toggles : [
          'followed-user-project',
          'followed-user-blog',
          'followed-user-general',
          'followed-user-question',
          'followed-project-blog',
          'followed-project-general',
          'followed-project-question',
      ]
  },{
      name    : 'FollowedFieldOrgCreation',
      title   : 'Fields and Organisations you follow',
      description : 'When something is posted to a field or organisation you follow.',
      toggles : [
          'followed-field-project',
          'followed-field-blog',
          'followed-field-general',
          'followed-field-question',
          'followed-organisation-project',
          'followed-organisation-blog',
          'followed-organisation-general',
          'followed-organisation-question',
      ]
  },{
      name    : 'FollowedCreationPost',
      title   : 'Blogs, Questions and discussion you follow',
      description : 'When someone posts on blog or thread you follow.',
      toggles : [
          'followed-question-post',
          'followed-blog-post',
          'followed-general-post',
          'followed-project-comment'
      ]
  },{
      name    : 'OwnCreationsPost',
      title   : 'Posts on your creations',
      description : 'When others reply to you or post on your creations.',
      toggles : [
          'own-question-post',
          'own-blog-post',
          'own-general-post',
          'own-project-comment',
          'own-post-post',
      ]
  },{
      name    : 'Mentions',
      title   : 'Mentions',
      description : 'When others mention you or your creations.',
      toggles : [
          'own-user-mention',
          'own-project-mention',
          'own-organisation-mention',
          'own-thread-mention'
      ]
  }
];
