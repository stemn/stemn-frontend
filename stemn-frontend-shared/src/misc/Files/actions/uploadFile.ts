import http from 'axios'

export interface IUploadFileInputs {
  /** Project Id */
  projectId: string
  /** Parent folder id */
  parent?: string
  /** File name including extension. eg) some_file.txt */
  name: string
  /** File content (the request body) */
  file?: Blob | string
}

export const uploadFile = ({ projectId, parent, name, file }: IUploadFileInputs) => ({
  type: 'FILE_LIST/UPLOAD_FILE' as const,
  payload: http({
    method: 'POST',
    url: `/api/v1/sync/upload/${projectId}`,
    params: { parent, name },
    data: file,
  }),
})
