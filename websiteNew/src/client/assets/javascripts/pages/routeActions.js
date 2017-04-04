export const fileRoute = ({projectId, fileId}) => `/files/${projectId}/${fileId}`
export const homeRoute = () => `/`
export const loginRoute = () => `/login`
export const projectFolderRoute = ({projectId, fileId}) => `/project/${projectId}/files/${fileId || ''}`
export const projectRoute = ({projectId}) => `/project/${projectId}`
export const projectSettingsRoute = ({projectId}) => `/project/${projectId}/settings`