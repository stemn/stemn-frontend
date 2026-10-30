/** Entities as the API sends them, for the tests */
import type { IComment, INotification, IProject, IThread } from '../models'

const user = (id: string, name = `User ${id}`) => ({
  _id: id,
  name,
  stub: id,
  picture: '',
  blurb: '',
  entityType: 'user',
})

export const ada = user('ada', 'Ada Lovelace')
export const priya = user('priya', 'Priya Raman')

export const thread = (id: string, changes: Partial<IThread> = {}): IThread => ({
  _id: id,
  __v: 0,
  name: `Thread ${id}`,
  stub: '',
  picture: '',
  type: '',
  body: '',
  due: '2026-10-30T00:00:00.000Z',
  complete: false,
  created: '2026-10-29T00:00:00.000Z',
  updated: '2026-10-29T00:00:00.000Z',
  project: { _id: 'p1', name: 'Project 1', entityType: 'project' },
  board: 'b1',
  group: 'g1',
  labels: [],
  owner: ada,
  threadNumber: 1,
  users: [ada],
  commits: [],
  mentions: [],
  numMentions: 0,
  numComments: 0,
  numFollowers: 0,
  entityType: 'thread',
  ...changes,
})

export const comment = (id: string, changes: Partial<IComment> = {}): IComment => ({
  _id: id,
  body: `Comment ${id}`,
  thread: { _id: 't1', name: 'Thread t1', entityType: 'thread' },
  owner: ada,
  project: 'p1',
  timestamp: '2026-10-29T00:00:00.000Z',
  reactions: [],
  mentions: [],
  entityType: 'comment',
  ...changes,
})

export const notification = (id: string, changes: Partial<INotification> = {}): INotification => ({
  _id: id,
  type: 'own-thread-comment',
  read: false,
  timestamp: '2026-10-29T00:00:00.000Z',
  template: '$$ commented on $$',
  picture1: '',
  entities: [],
  ...changes,
})

export const project = (id: string, changes: Partial<IProject> = {}) =>
  ({
    _id: id,
    name: `Project ${id}`,
    stub: id,
    picture: '',
    blurb: '',
    team: [],
    private: false,
    ...changes,
  }) as IProject // the tests only read these fields
