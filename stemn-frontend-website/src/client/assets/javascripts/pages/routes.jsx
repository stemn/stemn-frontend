/** ***************************************************************

Route config for react-router (data router / createBrowserRouter).

Every page component is wrapped with `withRouteProps` so it keeps
receiving the react-router v3 props it was written for:
`params`, `location` (with `.query`) and `children` (the child route).

Pages other than the app shells / landing page are code split
(`lazy`), like routes.production.js used to do.

**************************************************************** */

import React from 'react'
import { Navigate } from 'react-router'
import { withRouteProps } from 'stemn-shared/routing'
import { loading, complete } from 'stemn-shared/misc/CodeSplitting/CodeSplitting.actions'

// Routes which are always sync
import AppAuthed from 'pages/AppAuthed'
import AppRoot from 'pages/AppRoot'
import AppUnAuthed from 'pages/AppUnAuthed'
import NotFoundView from 'pages/NotFound'
import Landing from 'pages/Landing'

const sync = (Component) => ({ Component: withRouteProps(Component) })

function createRoutes({ dispatch }) {
  // Lazy (code split) route. Shows the route loading bar if the chunk takes > 1s.
  const lazy = (importPage) => ({
    lazy: () => {
      const loadingTimeout = setTimeout(() => dispatch(loading('route')), 1000)
      return importPage()
        .then((module) => ({ Component: withRouteProps(module.default) }))
        .finally(() => {
          clearTimeout(loadingTimeout)
          dispatch(complete('route'))
        })
    },
  })

  return [
    {
      ...sync(AppRoot),
      // Rendered while the first (lazy) route chunk loads; the index.html spinner covers it
      HydrateFallback: () => null,
      children: [
        {
          ...sync(AppAuthed),
          children: [
            {
              path: 'onboarding',
              ...lazy(() => import('pages/Onboarding')),
              children: [
                { index: true, ...lazy(() => import('pages/OnboardingAbout')) },
                { path: 'sync', ...lazy(() => import('pages/OnboardingSync')) },
                { path: 'download', ...lazy(() => import('pages/OnboardingDownload')) },
              ],
            },
            {
              path: 'settings',
              ...lazy(() => import('pages/Settings')),
              children: [
                { index: true, ...lazy(() => import('pages/SettingsProfile')) },
                { path: 'details', ...lazy(() => import('pages/SettingsProfileDetails')) },
                { path: 'account', ...lazy(() => import('pages/SettingsAccount')) },
                { path: 'billing', ...lazy(() => import('pages/SettingsBilling')) },
                { path: 'emails', ...lazy(() => import('pages/SettingsEmails')) },
                { path: 'projects', ...lazy(() => import('pages/SettingsProjects')) },
              ],
            },
            {
              path: 'notifications',
              ...lazy(() => import('pages/Notifications')),
              children: [
                { index: true, ...lazy(() => import('pages/NotificationsUnread')) },
                { path: 'unread', ...lazy(() => import('pages/NotificationsUnread')) },
                { path: 'all', ...lazy(() => import('pages/NotificationsAll')) },
              ],
            },
          ],
        },
        {
          ...sync(AppUnAuthed),
          children: [
            { path: 'login', ...lazy(() => import('pages/Login')) },
            { path: 'register', ...lazy(() => import('pages/Register')) },
          ],
        },
        { path: '/', ...lazy(() => import('pages/Home')) },
        { path: 'password-lost', ...lazy(() => import('stemn-shared/pages/PasswordLost')) },
        { path: 'password-reset', ...lazy(() => import('stemn-shared/pages/PasswordSet')) },
        {
          path: 'fields/:fieldId',
          ...lazy(() => import('pages/Field')),
          children: [{ index: true, ...lazy(() => import('pages/FieldOverview')) }],
        },
        { path: 'download', ...lazy(() => import('pages/Download')) },
        { path: 'explore', ...lazy(() => import('pages/Explore')) },
        { path: 'flow', ...lazy(() => import('pages/Flow')) },
        { path: 'files/:projectId/:fileId', ...lazy(() => import('pages/File')) },
        { path: 'landing', ...sync(Landing) },
        { path: 'open-source', ...lazy(() => import('pages/OpenSource')) },
        { path: 'pricing', ...lazy(() => import('pages/Pricing')) },
        { path: 'privacy', ...lazy(() => import('pages/Privacy')) },
        { path: 'search', ...lazy(() => import('pages/Search')) },
        { path: 'security', ...lazy(() => import('pages/Security')) },
        { path: 'terms', ...lazy(() => import('pages/Terms')) },
        { path: 'thread/:threadId', ...lazy(() => import('pages/Thread')) },
        {
          path: 'project/:stub',
          ...lazy(() => import('pages/Project')),
          children: [
            { index: true, ...lazy(() => import('pages/ProjectOverview')) },
            { path: 'team', ...lazy(() => import('pages/ProjectTeam')) },
            { path: 'files/:path', ...lazy(() => import('pages/ProjectOverview')) },
            { path: 'threads', ...lazy(() => import('pages/ProjectThreads')) },
            { path: 'threads/:threadId', ...lazy(() => import('pages/ProjectThread')) },
            { path: 'threads/:threadId/edit', ...lazy(() => import('pages/ProjectThread')) },
            { path: 'history', ...lazy(() => import('pages/ProjectCommits')) },
            { path: 'history/:commitId', ...lazy(() => import('pages/ProjectCommit')) },
            { path: 'pipelines', ...lazy(() => import('pages/ProjectPipelines')) },
            { path: 'pipelines/:pipelineId', ...lazy(() => import('pages/ProjectPipeline')) },
            { path: 'pipelines/:pipelineId/steps/:stepId', ...lazy(() => import('pages/ProjectPipelineStep')) },
            {
              path: 'settings',
              ...lazy(() => import('pages/ProjectSettings')),
              children: [
                { index: true, ...lazy(() => import('pages/ProjectSettingsGeneral')) },
                { path: 'permissions', ...lazy(() => import('pages/ProjectSettingsPermissions')) },
                { path: 'threads', ...lazy(() => import('pages/ProjectSettingsThreads')) },
                { path: 'team', ...lazy(() => import('pages/ProjectSettingsTeam')) },
                { path: 'tags', ...lazy(() => import('pages/ProjectSettingsTags')) },
              ],
            },
          ],
        },
        { path: '404', ...sync(NotFoundView) },
        {
          path: 'users/:stub',
          ...lazy(() => import('pages/User')),
          children: [
            { index: true, ...lazy(() => import('pages/UserOverview')) },
            { path: 'details', ...lazy(() => import('pages/UserDetails')) },
            { path: 'followers', ...lazy(() => import('pages/UserFollowers')) },
            { path: 'following', ...lazy(() => import('pages/UserFollowing')) },
            { path: 'projects', ...lazy(() => import('pages/UserProjects')) },
            { path: 'stars', ...lazy(() => import('pages/UserStars')) },
          ],
        },
        // Equivalent of v3 <Redirect from="*" to="404" />
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
  ]
}

export default createRoutes
