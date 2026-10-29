import { describe, expect, it } from 'vitest'
import reducer from './LocalPath.reducer'

describe('LocalPath reducer', () => {
  const prev = {
    project1: { loading: false, data: '/home/user/Stemn/project1' },
    project2: { loading: false, data: '/home/user/Stemn/project2' },
  }

  it('LOCAL_PATH/GET_PATH_PENDING replaces the entry with a loading one', () => {
    const next = reducer(prev, { type: 'LOCAL_PATH/GET_PATH_PENDING', meta: { projectId: 'project1' } })
    expect(next).toEqual({ ...prev, project1: { loading: true } })
    expect(next.project2).toBe(prev.project2)
  })

  it('LOCAL_PATH/GET_PATH_REJECTED stores a not-loading entry', () => {
    const next = reducer(prev, { type: 'LOCAL_PATH/GET_PATH_REJECTED', meta: { projectId: 'project3' } })
    expect(next).toEqual({ ...prev, project3: { loading: false } })
    expect(next.project1).toBe(prev.project1)
  })

  it('LOCAL_PATH/GET_PATH_FULFILLED stores the path', () => {
    const next = reducer(prev, {
      type: 'LOCAL_PATH/GET_PATH_FULFILLED',
      meta: { projectId: 'project1' },
      payload: { data: '/mnt/Stemn/project1' },
    })
    expect(next.project1).toEqual({ loading: false, data: '/mnt/Stemn/project1' })
    expect(next.project2).toBe(prev.project2)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
