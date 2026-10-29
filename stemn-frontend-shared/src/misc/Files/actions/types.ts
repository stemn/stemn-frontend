import type { IFile } from 'stemn-shared/misc/FileList/types'
import type { StemnThunk } from 'stemn-shared/redux/types'

/** The cloud provider a file lives on */
export type FileProvider = IFile['provider']

/**
 * A file revision. `projectId` is set for project files (`/sync/` endpoints); without it the file is read
 * straight from the provider (`/remote/` endpoints).
 */
export interface IFileRevisionInput {
  projectId?: string
  fileId: string
  revisionId?: string
  provider?: FileProvider
}

/** What the website and desktop `getFile` accept. `path` downloads to a blob URL (web) or a local file (desktop) */
export interface IGetFileInput extends IFileRevisionInput {
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'path'
}

/** What the website and desktop `renderFile` / `renderFileDownload` accept */
export interface IRenderFileInput extends IFileRevisionInput {
  timestamp?: string | number
}

/** The rejection the render reducers read */
export interface IRenderError {
  response: { data: { error: string } }
}

export interface ISaveFileInput {
  file: IFile
  fileUrl: string
  /** The <a> the download is started from (the website sets its href and clicks it) */
  anchorEl: HTMLElement
}

// The contracts both platform variants (`X.web.ts`, `X.desktop.ts`) implement, so shared code that imports
// `./X` sees the same API on both platforms. The variants return platform specific actions, hence `satisfies`.

/** Website: axios download (promise action). Desktop: the main process file cache (aliased action) */
export type GetFile = (input: IGetFileInput) => { type: 'FILES/GET_FILE'; meta: { cacheKey: string } }

/** Asks for a render over the websocket; the result arrives as RENDER/* websocket events */
export type RenderFile = (input: IRenderFileInput) => StemnThunk

/** Website: the render URL is stored (already _FULFILLED). Desktop: downloaded by the main process file cache */
export type RenderFileDownload = (input: IRenderFileInput) => {
  type: 'FILES/RENDER_FILE_DOWNLOAD' | 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED'
  meta: { cacheKey: string }
}

/** Website: download through a share link. Desktop: save dialog + download in the main process */
export type SaveFile = (input: ISaveFileInput) => StemnThunk<Promise<unknown>>
