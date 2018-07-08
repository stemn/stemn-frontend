import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'

const showThreadModal = ({ threadId }) => showModal({
  modalType: require('stemn-shared/misc/Threads/ThreadDisplayModal').default,
  limit: 1,
  modalProps: {
    threadId,
  },
})

export const commitRoute                 = ({ commitId, projectId })           => ({ scope: 'main', show: true, pathname: `/project/${projectId}/feed/commit/${commitId}` })
export const contactRoute                = ()                                  => ({ external: true, pathname: '/contact' })
export const downloadRoute               = ()                                  => ({ external: true, pathname: '/download' })
export const exploreRoute                = ()                                  => ({ external: true, pathname: '/explore' })
export const fieldRoute                  = ({ fieldId })                       => ({ external: true, pathname: `/fields/${fieldId}` })
export const fileRoute                   = ({ projectId, fileId, revisionId }) => ({ pathname: `/files/${projectId}/${fileId}`, query: { revision: revisionId } })
export const flowRoute                   = ()                                  => ({ external: true, pathname: '/flow' })
export const homeRoute                   = ()                                  => '/'
export const landingRoute                = ()                                  => ({ external: true, pathname: '/landing' })
export const loginRoute                  = ()                                  => ({ external: true, pathname: '/login' })
export const onboardingAboutRoute        = ()                                  => ({ external: true, pathname: '/onboarding' })
export const onboardingDownloadRoute     = ()                                  => ({ external: true, pathname: '/onboarding/download' })
export const onboardingSyncRoute         = ()                                  => ({ external: true, pathname: '/onboarding/sync' })
export const openSourceRoute             = ()                                  => ({ external: true, pathname: '/open-source' })
export const organisationRoute           = ({ organisationId })                => ({ external: true, pathname: `/organisaitons/${organisationId}` })
export const passwordLostRoute           = ()                                  => ({ external: true, pathname: '/password-lost' })
export const pricingRoute                = ()                                  => ({ external: true, pathname: '/pricing' })
export const privacyRoute                = ()                                  => ({ external: true, pathname: '/privacy' })
export const projectChangesRoute         = ({ projectId })                     => `/project/${projectId}`
export const projectCommitsRoute         = ({ projectId })                     => `/project/${projectId}/feed`
export const projectFilesRoute           = ({ projectId })                     => `/project/${projectId}/files`
export const projectFolderRoute          = ({ projectId, fileId })             => `/project/${projectId}/files/${fileId || ''}`
export const projectRoute                = ({ projectId })                     => `/project/${projectId}`
export const projectSettingsRoute        = ({ projectId })                     => `/project/${projectId}/settings`
export const projectSettingsTeamRoute    = ({ projectId })                     => `/project/${projectId}/settings/team`
export const projectSettingsThreadsRoute = ({ projectId })                     => `/project/${projectId}/settings/threads`
export const projectThreadsRoute         = ({ projectId })                     => `/project/${projectId}/threads`
export const projectTeamRoute            = ({ projectId })                     => `/project/${projectId}/team`
export const registerRoute               = ()                                  => ({ external: true, pathname: '/register' })
export const securityRoute               = ()                                  => ({ external: true, pathname: '/security' })
export const settingsRoute               = ()                                  => ({ external: true, pathname: '/settings' })
export const threadEditRoute             = ({ threadId, projectId })           => `/project/${projectId}/threads/${threadId}/edit`
export const threadRoute                 = ({ threadId, projectId })           => ({ scope: 'main', show: true, clickDispatch: showThreadModal({ threadId }) })
export const termsRoute                  = ()                                  => ({ external: true, pathname: '/terms' })
export const userDetailsRoute            = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/details` })
export const userFollowersRoute          = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/followers` })
export const userFollowingRoute          = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/following` })
export const userProjectsRoute           = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/projects` })
export const userRoute                   = ({ userId })                        => ({ external: true, pathname: `/users/${userId}` })
export const userStarsRoute              = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/stars` })

export const webCommitRoute              = ({ commitId, projectId })           => ({ external: true, pathname: `/project/${projectId}/history/${commitId}` })
export const webProjectRoute             = ({ projectId })                     => ({ external: true, pathname: `/project/${projectId}` })
export const webFileRoute                = ({ projectId, fileId, revisionId }) => ({ external: true, pathname: `/files/${projectId}/${fileId}`, query: { revision: revisionId } })

