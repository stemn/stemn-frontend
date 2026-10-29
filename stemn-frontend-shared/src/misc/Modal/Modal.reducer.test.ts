import { describe, expect, it, vi } from 'vitest'
import { promises } from './ModalPromises'
import reducer from './Modal.reducer'

const modal = (modalId: string, modalType = 'ConfirmModal') => ({
  modalId,
  modalType,
  modalProps: { title: 'Are you sure?' },
  modalOptions: { width: '400px' },
})

describe('Modal reducer', () => {
  const prev = { stack: [modal('m1'), modal('m2', 'ProjectCloneModal')], other: { x: 1 } }

  it('MODALS/SHOW_MODAL_PENDING pushes the modal', () => {
    const meta = modal('m3')
    const next = reducer(prev, { type: 'MODALS/SHOW_MODAL_PENDING', meta })
    expect(next.stack).toEqual([...prev.stack, meta])
    expect(next.stack[0]).toBe(prev.stack[0])
    expect(next.other).toBe(prev.other)
    expect(prev.stack).toHaveLength(2)
  })

  it('MODALS/SHOW_MODAL_PENDING respects the limit per modal type', () => {
    const meta = { ...modal('m3'), limit: 1 }
    expect(reducer(prev, { type: 'MODALS/SHOW_MODAL_PENDING', meta })).toBe(prev)
    const next = reducer(prev, { type: 'MODALS/SHOW_MODAL_PENDING', meta: { ...meta, limit: 2 } })
    expect(next.stack).toHaveLength(3)
  })

  it('MODALS/SHOW_MODAL_PENDING creates the stack when missing', () => {
    const meta = modal('m1')
    expect(reducer({} as any, { type: 'MODALS/SHOW_MODAL_PENDING', meta })).toEqual({ stack: [meta] })
  })

  it('MODALS/HIDE_MODAL removes the modal', () => {
    const next = reducer(prev, { type: 'MODALS/HIDE_MODAL', payload: { modalId: 'm1' } })
    expect(next.stack).toEqual([prev.stack[1]])
    expect(next.stack[0]).toBe(prev.stack[1])
    expect(next.other).toBe(prev.other)
  })

  it('MODALS/HIDE_MODAL returns the same state for an unknown modal', () => {
    expect(reducer(prev, { type: 'MODALS/HIDE_MODAL', payload: { modalId: 'unknown' } })).toBe(prev)
  })

  it('MODALS/CLOSE_ALL empties the stack', () => {
    const next = reducer(prev, { type: 'MODALS/CLOSE_ALL' })
    expect(next.stack).toEqual([])
    expect(next.other).toBe(prev.other)
  })

  it('MODALS/RESOLVE and MODALS/REJECT settle the modal promise without changing the state', () => {
    const resolve = vi.fn()
    const reject = vi.fn()
    promises['m1'] = { resolve, reject }
    expect(reducer(prev, { type: 'MODALS/RESOLVE', payload: { modalId: 'm1', data: { ok: true } } })).toBe(prev)
    expect(resolve).toHaveBeenCalledWith({ ok: true })
    expect(reducer(prev, { type: 'MODALS/REJECT', payload: { modalId: 'm1', data: 'cancelled' } })).toBe(prev)
    expect(reject).toHaveBeenCalledWith('cancelled')
    delete promises['m1']
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
