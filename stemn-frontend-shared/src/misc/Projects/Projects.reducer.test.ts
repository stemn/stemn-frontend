import { describe, expect, it } from 'vitest'
import reducer from './Projects.reducer'

const member = (id: string, role = 'admin') => ({ _id: id, name: `User ${id}`, permissions: { role } })
const field = (id: string) => ({ _id: id, name: `Field ${id}` })

const makeState = (): any => ({
  hydrated: true,
  data: {
    project1: {
      loading: false,
      dataSize: 'lg',
      data: {
        _id: 'project1',
        name: 'Bracket',
        team: [member('user1'), member('user2', 'viewer')],
        fields: [field('f1')],
      },
    },
    project2: { loading: false, data: { _id: 'project2', team: [] } },
  },
  activeProject: 'project1',
  userProjects: {
    user1: { loading: false, data: [{ _id: 'project1' }, { _id: 'project2' }] },
    user2: { loading: false, data: [] },
  },
  newProject: {
    summary: 'Draft',
    name: 'Draft',
    root: { path: '', fileId: '' },
    provider: '',
    private: false,
    savePending: true,
  },
  cloneProject: { name: '', provider: '', private: false, savePending: false },
})

describe('Projects reducer', () => {
  const prev = makeState()

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ activeProject: 'p9' }, { type: 'OTHER' })
    expect(next).toMatchObject({ activeProject: 'p9', data: {}, userProjects: {}, hydrated: true })
  })

  it('PROJECTS/SET_ACTIVE_PROJECT sets the active project', () => {
    const next = reducer(prev, { type: 'PROJECTS/SET_ACTIVE_PROJECT', payload: { projectId: 'project2' } })
    expect(next.activeProject).toBe('project2')
    expect(next.data).toBe(prev.data)
  })

  it('PROJECTS/GET_PROJECT_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'PROJECTS/GET_PROJECT_PENDING', meta: { projectId: 'project1' } })
    expect(pending.data.project1.loading).toBe(true)
    expect(pending.data.project1.data).toBe(prev.data.project1.data)
    expect(pending.data.project2).toBe(prev.data.project2)
    expect(pending.userProjects).toBe(prev.userProjects)
    const rejected = reducer(pending, { type: 'PROJECTS/GET_PROJECT_REJECTED', meta: { projectId: 'project1' } })
    expect(rejected.data.project1.loading).toBe(false)
  })

  it('PROJECTS/GET_PROJECT_FULFILLED stores the project', () => {
    const data = { _id: 'project3', name: 'Gearbox' }
    const next = reducer(prev, {
      type: 'PROJECTS/GET_PROJECT_FULFILLED',
      meta: { projectId: 'project3', size: 'sm' },
      payload: { data },
    })
    expect(next.data.project3).toEqual({ loading: false, dataSize: 'sm', data })
    expect(next.data.project1).toBe(prev.data.project1)
  })

  it('PROJECTS/ADD_TEAM_MEMBER adds the user as admin', () => {
    const user = { _id: 'user3', name: 'User user3' }
    const next = reducer(prev, { type: 'PROJECTS/ADD_TEAM_MEMBER', payload: { projectId: 'project1', user } })
    expect(next.data.project1.data.team).toEqual([...prev.data.project1.data.team, member('user3')])
    expect(next.data.project1.data.team[0]).toBe(prev.data.project1.data.team[0])
    expect(next.data.project1.data.fields).toBe(prev.data.project1.data.fields)
    expect(next.data.project2).toBe(prev.data.project2)
  })

  it('PROJECTS/REMOVE_TEAM_MEMBER removes the user', () => {
    const next = reducer(prev, {
      type: 'PROJECTS/REMOVE_TEAM_MEMBER',
      payload: { projectId: 'project1', userId: 'user1' },
    })
    expect(next.data.project1.data.team).toEqual([member('user2', 'viewer')])
    expect(next.data.project1.data.team[0]).toBe(prev.data.project1.data.team[1])
    expect(next.data.project2).toBe(prev.data.project2)
  })

  it('PROJECTS/CHANGE_USER_PERMISSIONS changes the role', () => {
    const next = reducer(prev, {
      type: 'PROJECTS/CHANGE_USER_PERMISSIONS',
      payload: { projectId: 'project1', userId: 'user2', role: 'collaborator' },
    })
    expect(next.data.project1.data.team[1]).toEqual(member('user2', 'collaborator'))
    expect(next.data.project1.data.team[0]).toBe(prev.data.project1.data.team[0])
    expect(prev.data.project1.data.team[1].permissions.role).toBe('viewer')
  })

  it('PROJECTS/ADD_FIELD adds a field once', () => {
    const next = reducer(prev, { type: 'PROJECTS/ADD_FIELD', payload: { projectId: 'project1', field: field('f2') } })
    expect(next.data.project1.data.fields).toEqual([field('f1'), field('f2')])
    expect(next.data.project1.data.team).toBe(prev.data.project1.data.team)
    const duplicate = reducer(prev, {
      type: 'PROJECTS/ADD_FIELD',
      payload: { projectId: 'project1', field: field('f1') },
    })
    expect(duplicate.data.project1.data.fields).toEqual([field('f1')])
  })

  it('PROJECTS/REMOVE_FIELD removes the field', () => {
    const next = reducer(prev, { type: 'PROJECTS/REMOVE_FIELD', payload: { projectId: 'project1', fieldId: 'f1' } })
    expect(next.data.project1.data.fields).toEqual([])
    expect(next.data.project1.data.team).toBe(prev.data.project1.data.team)
  })

  it.each([
    ['PROJECTS/SET_LIKED', {}, true],
    ['PROJECTS/SET_UN_LIKED', {}, false],
    ['PROJECTS/UPDATE_LIKED', { liked: true }, true],
  ])('%s sets liked', (type, extra, liked) => {
    const next = reducer(prev, { type, payload: { projectId: 'project1', ...extra } })
    expect(next.data.project1.data.liked).toBe(liked)
    expect(next.data.project1.data.team).toBe(prev.data.project1.data.team)
    expect(next.data.project2).toBe(prev.data.project2)
  })

  it('PROJECTS/LINK_REMOTE_PENDING / _FULFILLED / _REJECTED track the link state', () => {
    const pending = reducer(prev, { type: 'PROJECTS/LINK_REMOTE_PENDING', meta: { cacheKey: 'project1' } })
    expect(pending.data.project1).toMatchObject({ linkPending: true, linkRejected: false })
    expect(pending.data.project2).toBe(prev.data.project2)

    const remote = { provider: 'dropbox', root: { path: '/Bracket', id: 'id:1' } }
    const fulfilled = reducer(pending, {
      type: 'PROJECTS/LINK_REMOTE_FULFILLED',
      meta: { cacheKey: 'project1' },
      payload: { data: remote },
    })
    expect(fulfilled.data.project1).toMatchObject({ linkPending: false, linkRejected: false, fileStoreForm: remote })
    expect(fulfilled.data.project1.data.remote).toBe(remote)
    expect(fulfilled.data.project1.data.team).toBe(prev.data.project1.data.team)

    const rejected = reducer(pending, { type: 'PROJECTS/LINK_REMOTE_REJECTED', meta: { cacheKey: 'project1' } })
    expect(rejected.data.project1).toMatchObject({ linkPending: false, linkRejected: true })
  })

  it('PROJECTS/GET_USER_PROJECTS_PENDING / _REJECTED / _FULFILLED track the user projects', () => {
    const pending = reducer(prev, { type: 'PROJECTS/GET_USER_PROJECTS_PENDING', meta: { userId: 'user2' } })
    expect(pending.userProjects.user2.loading).toBe(true)
    expect(pending.userProjects.user1).toBe(prev.userProjects.user1)
    expect(pending.data).toBe(prev.data)
    const rejected = reducer(pending, { type: 'PROJECTS/GET_USER_PROJECTS_REJECTED', meta: { userId: 'user2' } })
    expect(rejected.userProjects.user2.loading).toBe(false)
    const data = [{ _id: 'project5' }]
    const fulfilled = reducer(pending, {
      type: 'PROJECTS/GET_USER_PROJECTS_FULFILLED',
      meta: { userId: 'user2' },
      payload: { data },
    })
    expect(fulfilled.userProjects.user2).toEqual({ loading: false, data })
  })

  it('PROJECTS/CREATE_PROJECT_PENDING and _REJECTED toggle savePending', () => {
    const pending = reducer(
      { ...prev, newProject: { ...prev.newProject, savePending: false } },
      { type: 'PROJECTS/CREATE_PROJECT_PENDING' },
    )
    expect(pending.newProject.savePending).toBe(true)
    const rejected = reducer(prev, { type: 'PROJECTS/CREATE_PROJECT_REJECTED' })
    expect(rejected.newProject.savePending).toBe(false)
    expect(rejected.newProject.root).toBe(prev.newProject.root)
    expect(rejected.data).toBe(prev.data)
  })

  it('PROJECTS/CREATE_PROJECT_FULFILLED resets the form and adds the project to the user', () => {
    const data = { _id: 'project6', name: 'New' }
    const next = reducer(prev, {
      type: 'PROJECTS/CREATE_PROJECT_FULFILLED',
      meta: { userId: 'user1' },
      payload: { data },
    })
    expect(next.newProject).toEqual({
      summary: '',
      name: '',
      root: { path: '', fileId: '' },
      provider: '',
      private: false,
      savePending: '',
    })
    expect(next.userProjects.user1.data).toEqual([...prev.userProjects.user1.data, data])
    expect(next.userProjects.user2).toBe(prev.userProjects.user2)
    expect(next.data).toBe(prev.data)
  })

  it.each([
    ['PROJECTS/SAVE_PROJECT_PENDING', true],
    ['PROJECTS/SAVE_PROJECT_FULFILLED', false],
    ['PROJECTS/SAVE_PROJECT_REJECTED', false],
  ])('%s sets savePending', (type, savePending) => {
    const next = reducer(prev, { type, meta: { projectId: 'project2' } })
    expect(next.data.project2.savePending).toBe(savePending)
    expect(next.data.project1).toBe(prev.data.project1)
  })

  it.each([
    ['PROJECTS/CLONE_PENDING', true],
    ['PROJECTS/CLONE_FULFILLED', false],
    ['PROJECTS/CLONE_REJECTED', false],
  ])('%s sets the clone savePending', (type, savePending) => {
    const start = { ...prev, cloneProject: { ...prev.cloneProject, savePending: !savePending } }
    const next = reducer(start, { type })
    expect(next.cloneProject.savePending).toBe(savePending)
    expect(next.data).toBe(prev.data)
  })

  it('PROJECTS/DELETE_PROJECT_FULFILLED removes the project from the store and the user list', () => {
    const next = reducer(prev, {
      type: 'PROJECTS/DELETE_PROJECT_FULFILLED',
      meta: { projectId: 'project1', userId: 'user1' },
    })
    expect(next.data).toHaveProperty('project1', undefined)
    expect(next.data.project2).toBe(prev.data.project2)
    expect(next.userProjects.user1.data).toEqual([{ _id: 'project2' }])
    expect(next.userProjects.user2).toBe(prev.userProjects.user2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'PROJECTS/CLONE_FULFILLED' })).toBe(prev)
    expect(reducer(prev, { type: 'PROJECTS/SET_LIKED', payload: { projectId: 'project1' } })).not.toBe(prev)
    const liked = reducer(prev, { type: 'PROJECTS/SET_LIKED', payload: { projectId: 'project1' } })
    expect(reducer(liked, { type: 'PROJECTS/UPDATE_LIKED', payload: { projectId: 'project1', liked: true } })).toBe(
      liked,
    )
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
