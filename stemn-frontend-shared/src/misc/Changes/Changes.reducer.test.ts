import { describe, expect, it } from 'vitest'
import reducer from './Changes.reducer'

const revision = (id: string, fileId: string) => ({ _id: id, data: { fileId, name: `${fileId}.step` } })

describe('Changes reducer', () => {
  const prev: any = {
    project1: {
      data: [revision('rev1', 'file1'), revision('rev2', 'file2'), revision('rev3', 'file3')],
      selected: {},
      checked: { file1: true },
      loading: false,
      name: 'Update bracket',
      body: 'Body',
    },
    project2: { data: [], loading: false },
  }

  it('CHANGES/DESELECT_FILE_CHANGE clears the selection', () => {
    const start = { ...prev, project1: { ...prev.project1, selected: prev.project1.data[0] } }
    const next = reducer(start, { type: 'CHANGES/DESELECT_FILE_CHANGE', payload: { projectId: 'project1' } })
    expect(next.project1.selected).toEqual({})
    expect(next.project1.data).toBe(prev.project1.data)
    expect(next.project2).toBe(prev.project2)
  })

  it('CHANGES/SELECTED_FILE_CHANGE selects the change', () => {
    const selected = prev.project1.data[1]
    const next = reducer(prev, { type: 'CHANGES/SELECTED_FILE_CHANGE', payload: { projectId: 'project1', selected } })
    expect(next.project1.selected).toBe(selected)
    expect(next.project1.checked).toBe(prev.project1.checked)
    expect(next.project2).toBe(prev.project2)
  })

  it('CHANGES/MENTION_THREADS appends the new mentions to the body', () => {
    const mentions = [{ mentionId: 'm1', entityId: 'thread1', display: 'Fix hinge', mentionType: 'thread' }]
    const next = reducer(prev, { type: 'CHANGES/MENTION_THREADS', payload: { projectId: 'project1', mentions } })
    expect(next.project1.body).toContain('Body')
    expect(next.project1.body).toContain('thread1')
    expect(next.project1.data).toBe(prev.project1.data)
    expect(next.project2).toBe(prev.project2)
  })

  it('CHANGES/TOGGLE_ALL_CHANGED_FILES checks every changed file', () => {
    const next = reducer(prev, {
      type: 'CHANGES/TOGGLE_ALL_CHANGED_FILES',
      payload: { projectId: 'project1', value: true },
    })
    expect(next.project1.checked).toEqual({ file1: true, file2: true, file3: true })
    expect(next.project1.data).toBe(prev.project1.data)
    expect(next.project2).toBe(prev.project2)
  })

  it('CHANGES/FETCH_CHANGES_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'CHANGES/FETCH_CHANGES_PENDING', meta: { projectId: 'project2' } })
    expect(pending.project2).toEqual({ data: [], loading: true })
    expect(pending.project1).toBe(prev.project1)
    const rejected = reducer(pending, { type: 'CHANGES/FETCH_CHANGES_REJECTED', meta: { projectId: 'project2' } })
    expect(rejected.project2.loading).toBe(false)
  })

  it('CHANGES/FETCH_CHANGES_FULFILLED stores the changes', () => {
    const data = [revision('rev4', 'file4')]
    const next = reducer(prev, {
      type: 'CHANGES/FETCH_CHANGES_FULFILLED',
      meta: { projectId: 'project2' },
      payload: { data },
    })
    expect(next.project2).toEqual({ data, loading: false })
    expect(next.project1).toBe(prev.project1)
  })

  it('CHANGES/COMMIT_FULFILLED removes the committed revisions and clears the message', () => {
    const next = reducer(prev, {
      type: 'CHANGES/COMMIT_FULFILLED',
      meta: { cacheKey: 'project1' },
      payload: { data: { _id: 'commit1', revisions: ['rev1', { _id: 'rev3' }] } },
    })
    expect(next.project1.data).toEqual([prev.project1.data[1]])
    expect(next.project1.data[0]).toBe(prev.project1.data[1])
    expect(next.project1.name).toBe('')
    expect(next.project1.body).toBe('')
    // `checked: {}` is deep-merged, so the existing checked object is kept
    expect(next.project1.checked).toBe(prev.project1.checked)
    expect(next.project2).toBe(prev.project2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'CHANGES/FETCH_CHANGES_REJECTED', meta: { projectId: 'project1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
