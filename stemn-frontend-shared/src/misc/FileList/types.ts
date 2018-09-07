export interface IFile {
  clone: {
    source?: string,
    timestamp?: string,
  },
  deleted: boolean,
  entityType: 'file',
  fileId: string,
  hash: string,
  modified: string,
  name: string,
  numParents: number,
  owner: {
    _id: string,
    id: string,
    name: string,
    picture: string,
  },
  parent: string,
  parents: Array<{
    fileId: string,
    name: string,
    path: string,
  }>,
  path: string,
  project: {
    _id: string,
  },
  provider: 'dropbox' | 'drive',
  revisionId: string,
  revisionNumber: number,
  revisions: string[],
  root: string,
  size: string,
  state: string,
  timestamp: string,
  type: 'file',
  _v: number,
  _id: string,
}

export interface IFolder {
  clone: {
    source?: string,
    timestamp?: string,
  },
  deleted: boolean,
  entityType: 'file',
  extension: string,
  fileId: string,
  hash: string,
  modified: string,
  name: string,
  numParents: number,
  owner: {
    _id: string,
    id: string,
    name: string,
    picture: string,
  },
  parent: string,
  parents: Array<{
    fileId: string,
    name: string,
    path: string,
  }>,
  path: string,
  project: {
    _id: string,
  },
  provider: 'dropbox' | 'drive',
  revisionId: string,
  revisionNumber: number,
  revisions: string[],
  root: string,
  size: string,
  state: string,
  timestamp: string,
  type: 'folder',
  _v: number,
  _id: string,
}
