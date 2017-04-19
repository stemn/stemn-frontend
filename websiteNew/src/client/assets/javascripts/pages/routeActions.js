export const commitRoute          = ({ commitId, projectId }) => `/project/${projectId}/commits/${commitId}`
export const fileRoute            = ({ projectId, fileId })   => `/files/${projectId}/${fileId}`
export const homeRoute            = ()                        => `/`
export const loginRoute           = ()                        => `/login`
export const projectFolderRoute   = ({ projectId, fileId })   => `/project/${projectId}/files/${fileId || ''}`
export const projectRoute         = ({ projectId })           => `/project/${projectId}`
export const projectTeamRoute     = ({ projectId })           => `/project/${projectId}/team`
export const projectFilesRoute    = ({ projectId })           => `/project/${projectId}/files`
export const projectTasksRoute    = ({ projectId })           => `/project/${projectId}/tasks`
export const projectCommitsRoute  = ({ projectId })           => `/project/${projectId}/commits`
export const projectSettingsRoute = ({ projectId })           => `/project/${projectId}/settings`
export const taskRoute            = ({ taskId, projectId })   => `/project/${projectId}/tasks/${taskId}`
export const userRoute            = ({ userId })              => `/users/${userId}/`
export const userFollowingRoute   = ({ userId })              => `/users/${userId}/following`
export const userFollowersRoute   = ({ userId })              => `/users/${userId}/followers`
export const userProjectsRoute    = ({ userId })              => `/users/${userId}/projects`
export const userDetailsRoute     = ({ userId })              => `/users/${userId}/details`
export const userStarsRoute       = ({ userId })              => `/users/${userId}/stars`
export const settingsRoute        = ()                        => `/settings`
export const termsRoute           = ()                        => `/terms`
export const privacyRoute         = ()                        => `/privacy`
export const securityRoute        = ()                        => `/security`
export const contactRoute         = ()                        => `/contact`
export const organisationRoute    = ({ organisationId })      => `/organisaitons/${organisationId}`
export const exploreRoute         = ()                        => `/explore`
export const pricingRoute         = ()                        => `/pricing`
export const landingRoute         = ()                        => `/landing`
export const featuresRoute        = ()                        => `/features`
export const downloadRoute        = ()                        => `/download`
export const openSourceRoute      = ()                        => `/open-source`
export const onboardingAboutRoute = ()                        => `/onboarding`
export const onboardingSyncRoute  = ()                        => `/onboarding/sync`
export const onboardingDownloadRoute  = ()                    => `/onboarding/download`
export const fieldRoute           = ({ fieldId })             => `/fields/${fieldId}`
