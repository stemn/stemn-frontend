import type { IFile } from 'stemn-shared/misc/FileList/types'

type IDownloadable = Pick<IFile, 'fileId' | 'provider'> & { revisionId?: string; project?: { _id?: string } }

/** Download URL of a file revision: through the project (`/sync/`) or straight from the provider (`/remote/`) */
export default (fileMeta: IDownloadable) =>
  fileMeta.project && fileMeta.project._id
    ? `${GLOBAL_ENV.API_SERVER}/api/v1/sync/download/${fileMeta.project._id}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`
    : `${GLOBAL_ENV.API_SERVER}/api/v1/remote/download/${fileMeta.provider}/${fileMeta.fileId}${fileMeta.revisionId ? `?revisionId=${fileMeta.revisionId}` : ''}`
