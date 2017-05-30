import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import threadDisplayModalName from 'stemn-shared/misc/Threads/ThreadDisplayModal'

const showThreadModal = ({ threadId }) => showModal({
  modalType: threadDisplayModalName,
  limit: 1,
  modalProps: {
    threadId
  }
})

export const commitRoute                 = ({ commitId, projectId })           => ({ scope: 'main', show: true, pathname: `/project/${projectId}/feed?item=${commitId}`})
export const contactRoute                = ()                                  => `/contact`
export const downloadRoute               = ()                                  => `/download`
export const exploreRoute                = ()                                  => `/explore`
export const fieldRoute                  = ({ fieldId })                       => `/fields/${fieldId}`
export const fileRoute                   = ({ projectId, fileId, revisionId }) => ({ pathname: `/files/${projectId}/${fileId}`, query: { revision: revisionId } })
export const flowRoute                   = ()                                  => `/flow`
export const homeRoute                   = ()                                  => `/`
export const landingRoute                = ()                                  => `/landing`
export const loginRoute                  = ()                                  => `/login`
export const onboardingAboutRoute        = ()                                  => `/onboarding`
export const onboardingDownloadRoute     = ()                                  => `/onboarding/download`
export const onboardingSyncRoute         = ()                                  => `/onboarding/sync`
export const openSourceRoute             = ()                                  => `/open-source`
export const organisationRoute           = ({ organisationId })                => `/organisaitons/${organisationId}`
export const passwordLostRoute           = ()                                  => ({ external: true, pathname: '/password-lost' })
export const pricingRoute                = ()                                  => `/pricing`
export const privacyRoute                = ()                                  => `/privacy`
export const projectCommitsRoute         = ({ projectId })                     => `/project/${projectId}/history`
export const projectFilesRoute           = ({ projectId })                     => `/project/${projectId}/files`
export const projectFolderRoute          = ({ projectId, fileId })             => `/project/${projectId}/files/${fileId || ''}`
export const projectRoute                = ({ projectId })                     => `/project/${projectId}`
export const projectSettingsRoute        = ({ projectId })                     => `/project/${projectId}/settings`
export const projectSettingsTeamRoute    = ({ projectId })                     => `/project/${projectId}/settings/team`
export const projectSettingsThreadsRoute = ({ projectId })                     => `/project/${projectId}/settings/threads`
export const projectThreadsRoute           = ({ projectId })                     => `/project/${projectId}/threads`
export const projectTeamRoute            = ({ projectId })                     => `/project/${projectId}/team`
export const registerRoute               = ()                                  => ({ external: true, pathname: '/register'})
export const securityRoute               = ()                                  => ({ external: true, pathname: `/security`})
export const settingsRoute               = ()                                  => ({ external: true, pathname: `/settings`})
export const threadEditRoute               = ({ threadId, projectId })             => `/project/${projectId}/threads/${threadId}/edit`
export const threadRoute                   = ({ threadId, projectId })             => ({ scope: 'main', show: true, clickDispatch: showThreadModal({ threadId })})
export const termsRoute                  = ()                                  => ({ external: true, pathname: `/terms`})
export const userDetailsRoute            = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/details`})
export const userFollowersRoute          = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/followers`})
export const userFollowingRoute          = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/following`})
export const userProjectsRoute           = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/projects`})
export const userRoute                   = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/`})
export const userStarsRoute              = ({ userId })                        => ({ external: true, pathname: `/users/${userId}/stars`})
