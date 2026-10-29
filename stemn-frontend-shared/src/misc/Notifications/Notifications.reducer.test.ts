import { describe, expect, it } from 'vitest'
import reducer from './Notifications.reducer'

const notification = (id: string, read = false) => ({ _id: id, read, message: `Notification ${id}` })

describe('Notifications reducer', () => {
  const prev: any = { data: [notification('n1'), notification('n2', true), notification('n3')], other: { x: 1 } }

  it('NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED replaces the notifications', () => {
    const data = [notification('n4')]
    const next = reducer(prev, { type: 'NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED', payload: { data } })
    expect(next.data).toBe(data)
    expect(next.other).toBe(prev.other)
  })

  it('NOTIFICATIONS/MARK_AS_READ_PENDING marks the notification as read', () => {
    const next = reducer(prev, { type: 'NOTIFICATIONS/MARK_AS_READ_PENDING', meta: { notificationId: 'n1' } })
    expect(next.data[0]).toEqual({ ...prev.data[0], read: true })
    expect(next.data[1]).toBe(prev.data[1])
    expect(next.data[2]).toBe(prev.data[2])
    expect(prev.data[0].read).toBe(false)
    expect(next.other).toBe(prev.other)
  })

  it('NOTIFICATIONS/MARK_AS_READ_REJECTED marks the notification as unread', () => {
    const next = reducer(prev, { type: 'NOTIFICATIONS/MARK_AS_READ_REJECTED', meta: { notificationId: 'n2' } })
    expect(next.data[1]).toEqual({ ...prev.data[1], read: false })
    expect(next.data[0]).toBe(prev.data[0])
  })

  it('returns the same state when nothing changes', () => {
    const action = { type: 'NOTIFICATIONS/GET_NOTIFICATIONS_FULFILLED', payload: { data: prev.data } }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
