export const getFileRouteName = (file) => {
  if (file.type === 'file') {
    return 'fileRoute'
  } else if (file.type === 'folder') {
    return 'projectFolderRoute'
  } 
  return 'projectRoute'
}

export const getFileRouteParams = file => ({
  fileId: file.fileId,
  projectId: file && file.project && file.project._id,
  revisionId: file.revisionId,
})
