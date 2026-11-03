/**
 * What the review covers: the directions, the screens and the components with their stable ids.
 * The ids are the feedback vocabulary ("B-C06" is direction B's file list), so never renumber them.
 */
export const directions = [
  {
    id: 'current',
    letter: '0',
    name: 'Current',
    tagline: 'What staging looks like today, for reference',
    summary: 'Open Sans, 1px boxes on light grey, one blue accent, uppercase labels. Clean, but dated.',
    fonts: 'Open Sans, PT Serif',
    swatches: ['#fafafa', '#ffffff', '#4484d3', '#333333'],
  },
  {
    id: 'a',
    letter: 'A',
    name: 'Hairline',
    tagline: 'Monochrome and quiet, closest to what you have',
    summary:
      'White canvas, 1px hairlines, ink-black primary actions and colour reserved for status. The most conservative step: the same minimal idea, tightened up.',
    fonts: 'Inter, JetBrains Mono',
    swatches: ['#ffffff', '#f7f7f8', '#18181b', '#2563eb'],
  },
  {
    id: 'b',
    letter: 'B',
    name: 'Soft Studio',
    tagline: 'Friendly, floating, rounded',
    summary:
      'Borderless white cards with soft shadows on a cool grey canvas, a floating nav bar, segmented tabs and an indigo accent that picks up the login gradient.',
    fonts: 'Plus Jakarta Sans',
    swatches: ['#f4f5fa', '#ffffff', '#5b5bd6', '#1e2030'],
  },
  {
    id: 'c',
    letter: 'C',
    name: 'Blueprint',
    tagline: 'Precise, technical, made for engineers',
    summary:
      'Square corners, visible structure, monospaced metadata and a dense file table, like a drawing title block. A signal-orange accent. The most distinctive for a CAD product.',
    fonts: 'IBM Plex Sans, IBM Plex Mono',
    swatches: ['#f6f7f4', '#ffffff', '#e8590c', '#1b2a33'],
  },
  {
    id: 'd',
    letter: 'D',
    name: 'Graphite',
    tagline: 'Dark, focused, CAD-tool native',
    summary:
      'Near-black surfaces with quiet borders and an azure accent. Models and diffs stand out the way they do in desktop CAD. The biggest shift from today.',
    fonts: 'Geist, Geist Mono',
    swatches: ['#0e0f12', '#17191d', '#4c9aff', '#e8eaed'],
  },
  {
    id: 'e',
    letter: 'E',
    name: 'Workspace',
    tagline: 'Warm, editorial, with a sidebar',
    summary:
      'The top bar becomes a left sidebar so content gets more width. Warm paper tones, serif page titles and a deep green accent. Tests a layout change as well as a style.',
    fonts: 'Newsreader, Instrument Sans',
    swatches: ['#f8f6f1', '#fffefb', '#1f6f54', '#2a2722'],
  },
]

/** Screens: P = a real route, S = a state opened on top of one. Filled in by capture.mjs (see `steps` there). */
export const pages = [
  { id: 'P01', name: 'Dashboard' },
  { id: 'P02', name: 'Explore' },
  { id: 'P03', name: 'Project overview' },
  { id: 'P04', name: 'Project threads' },
  { id: 'P05', name: 'Thread' },
  { id: 'P06', name: 'Project history' },
  { id: 'P07', name: 'File: 3D CAD viewer' },
  { id: 'P08', name: 'File: revision diff' },
  { id: 'P09', name: 'Notifications' },
  { id: 'P10', name: 'Settings' },
  { id: 'P11', name: 'User profile' },
  { id: 'P12', name: 'Sign in' },
  { id: 'P13', name: 'Empty state' },
  { id: 'S01', name: 'Dropdown and menu open', viewportOnly: true },
  { id: 'S02', name: 'Modal', viewportOnly: true },
  { id: 'S03', name: 'Toast', viewportOnly: true },
]

/**
 * Components: `sel` is a selector, or a list of selectors whose boxes are joined. The first visible match wins.
 * Class names are `<File>_<class>` prefixes of the CSS-module names, matched by `[class^=…], [class*=" …"]`.
 */
export const components = [
  // App shell
  { id: 'C01', group: 'App shell', name: 'Navigation', page: 'P01', sel: '.Header_header', maxHeight: 340 },
  { id: 'C02', group: 'App shell', name: 'Page title bar', page: 'P01', sel: '.SubHeader_header' },
  { id: 'C03', group: 'App shell', name: 'Project header and tabs', page: 'P03', sel: '.SubHeader_header' },
  { id: 'C04', group: 'App shell', name: 'Footer', page: 'P10', sel: '.Footer_footer' },

  // Controls
  { id: 'C05', group: 'Controls', name: 'Buttons and filter toolbar', page: 'P04', sel: '.SubSubHeader_header' },
  {
    id: 'C06',
    group: 'Controls',
    name: 'Tags and social buttons',
    page: 'P03',
    sel: 'div:has(.Tag_tag):has(.SocialButton_button):not(:has(.ProjectOverview_blurb))',
  },
  { id: 'C07', group: 'Controls', name: 'Dropdown menu', page: 'S01', sel: '.Popover-body' },
  { id: 'C08', group: 'Controls', name: 'Modal', page: 'S02', sel: '.Modal_modal' },
  { id: 'C09', group: 'Controls', name: 'Toast', page: 'S03', sel: '.Toasts-web_toastInner' },
  { id: 'C10', group: 'Controls', name: 'Form fields', page: 'P10', sel: '.styles_root' },

  // Projects and files
  {
    id: 'C11',
    group: 'Projects and files',
    name: 'Project info panel',
    page: 'P03',
    sel: '.ProjectOverview_infoBoxes',
  },
  { id: 'C12', group: 'Projects and files', name: 'File list', page: 'P03', sel: '.ProjectOverview_files' },
  { id: 'C13', group: 'Projects and files', name: 'README and markdown', page: 'P03', sel: '.Readme_readme' },
  {
    id: 'C14',
    group: 'Projects and files',
    name: 'Featured project tiles',
    page: 'P02',
    sel: '.Row_root:has(.FeaturedTile_tile)',
  },
  { id: 'C15', group: 'Projects and files', name: 'Project rows', page: 'P02', sel: '.ProjectRow_project' },
  {
    id: 'C16',
    group: 'Projects and files',
    name: 'Field chips',
    page: 'P02',
    sel: '.Col_root:has(.Tag_tag):not(:has(.ProjectRow_project))',
  },
  { id: 'C17', group: 'Projects and files', name: 'My Projects panel', page: 'P01', sel: '.MyProjectsPanel_panel' },

  // Conversations and activity
  {
    id: 'C18',
    group: 'Threads and activity',
    name: 'Activity feed',
    page: 'P01',
    sel: '.TimelineVertical_group:has(.CommentBody_comment)',
  },
  {
    id: 'C19',
    group: 'Threads and activity',
    name: 'Thread filter sidebar',
    page: 'P04',
    sel: '.Col_root:has(> .ProjectThreads_panel)',
  },
  { id: 'C20', group: 'Threads and activity', name: 'Thread rows', page: 'P04', sel: '.ProjectThreads_threadsPanel' },
  { id: 'C21', group: 'Threads and activity', name: 'Thread header', page: 'P05', sel: '.SubSubHeader_header' },
  { id: 'C22', group: 'Threads and activity', name: 'Comments', page: 'P05', sel: 'div:has(> .Comment_comment)' },
  {
    id: 'C23',
    group: 'Threads and activity',
    name: 'Thread side panels',
    page: 'P05',
    sel: 'div:has(> .ProjectThread_panel)',
  },
  { id: 'C24', group: 'Threads and activity', name: 'Comment composer', page: 'P05', sel: '.CommentNew_commentNew' },
  {
    id: 'C25',
    group: 'Threads and activity',
    name: 'Notification rows',
    page: 'P09',
    sel: 'div:has(> .NotificationItem_notification)',
  },
  {
    id: 'C26',
    group: 'Threads and activity',
    name: 'History graph',
    page: 'P06',
    sel: '.ProjectCommits_graphPanel',
    note: 'The counts in this graph are made up for the review: the seed data has none in its range.',
  },

  // CAD workspace
  { id: 'C27', group: 'CAD workspace', name: 'File top bar', page: 'P07', sel: '.File_header' },
  { id: 'C28', group: 'CAD workspace', name: 'File details sidebar', page: 'P07', sel: '.File_sidebar' },
  { id: 'C29', group: 'CAD workspace', name: '3D viewer', page: 'P07', sel: '.File_preview' },
  { id: 'C30', group: 'CAD workspace', name: 'Revision timeline', page: 'P07', sel: '.File_timeline' },
  { id: 'C31', group: 'CAD workspace', name: 'Diff toolbar', page: 'P08', sel: '.FileDiffView_toolbar' },
  { id: 'C32', group: 'CAD workspace', name: 'Diff entity panel', page: 'P08', sel: '.FileDiffView_panel' },

  // Account
  {
    id: 'C33',
    group: 'Account',
    name: 'Settings navigation',
    page: 'P10',
    sel: '.Col_root:has(> .NavPillContainer_root)',
  },
  { id: 'C34', group: 'Account', name: 'User profile card', page: 'P11', sel: '.User_userPanel' },
  {
    id: 'C35',
    group: 'Account',
    name: 'Contribution heatmap',
    page: 'P11',
    sel: '.UserOverview_panel:has(.react-calendar-heatmap)',
  },
  { id: 'C36', group: 'Account', name: 'Sign-in card', page: 'P12', sel: '.Login_panel' },
  { id: 'C37', group: 'Account', name: 'Empty state', page: 'P13', sel: '.ProjectPipelines_innerContent' },
].map((component) => ({ ...component, sel: [component.sel].flat() }))
