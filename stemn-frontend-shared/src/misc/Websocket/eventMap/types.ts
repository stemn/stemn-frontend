import type { IStemnDispatch } from 'stemn-shared/redux/types'

/** The store the event map is given (the website store, or the desktop main process store) */
export interface ISocketEventStore {
  dispatch: IStemnDispatch
  getState: () => { auth: { user: { _id?: string } } }
}

/** A server event. `actioner` is the id of the user whose change triggered it */
type SocketEventOf<T extends string, P extends object = object> = { type: T; payload: P & { actioner?: string } }

export type BoardEvent =
  | SocketEventOf<'BOARD/BOARD_UPDATED', { boardId: string }>
  | SocketEventOf<'BOARD/GROUPS_UPDATED', { boardId: string; groups: string[] }>
  | SocketEventOf<'BOARD/THREADS_UPDATED', { threads: string[] }>
  | SocketEventOf<'BOARD/TASK_COMPLETED_UPDATED', { threadId: string }>
  | SocketEventOf<'BOARD/COMMENTS_UPDATED', { comments: string[] }>

export type FilesEvent = SocketEventOf<'FILES/FILES_UPDATED', { files: string[]; provider: string }>

export type PipelineEvent =
  /** `lines`: [line number, text] pairs */
  | SocketEventOf<'PIPELINE/STEP_LOGS', { pipelineId: string; stepId: string; lines: [number, string][] }>
  | SocketEventOf<'PIPELINE/STEP_UPDATED', { stepId: string }>
  | SocketEventOf<'PIPELINE/PIPELINE_UPDATED', { pipelineId: string }>
  | SocketEventOf<'PIPELINE/PIPELINE_CREATED'>

export type ProjectEvent =
  | SocketEventOf<'PROJECT/ADDED_TO_PROJECT'>
  | SocketEventOf<'PROJECT/PROJECT_UPDATED' | 'PROJECT/NEW_CHANGES' | 'PROJECT/NEW_COMMITS', { projectId: string }>

export type RenderEvent =
  | SocketEventOf<
      'RENDER/RENDER_DOWNLOAD',
      { projectId?: string; fileId: string; revisionId: string; provider?: 'dropbox' | 'drive'; timestamp?: string }
    >
  | SocketEventOf<'RENDER/RENDER_FAILED', { fileId: string; revisionId: string; error: string }>
  /** `roomId` is the render id (the file cache key) */
  | SocketEventOf<'RENDER/RENDER_PROGRESS', { roomId: string; message: string }>

export type ThreadEvent =
  | SocketEventOf<'THREAD/THREAD_UPDATED', { threadId: string }>
  /** `comment` is the comment id */
  | SocketEventOf<'THREAD/COMMENT_UPDATED', { comment: string }>

/** The events the app handles. Others are ignored (every handler's switch falls through) */
export type SocketEvent = BoardEvent | FilesEvent | PipelineEvent | ProjectEvent | RenderEvent | ThreadEvent

export type SocketEventHandler = (store: ISocketEventStore, action: SocketEvent) => unknown
