import { describe, expect, it } from 'vitest'
import reducer, { IWebsocketState } from './Websocket.reducer'

/** The state plus a key the reducer does not know, to check it is kept */
type State = IWebsocketState & { other: { x: number } }

describe('Websocket reducer', () => {
  const prev: State = {
    rooms: {
      'project-p1': { room: 'p1', type: 'project', status: true },
      'board-b1': { room: 'b1', type: 'board', status: true },
    },
    other: { x: 1 },
  }

  it('WEBSOCKET/JOIN_ROOM adds the room', () => {
    const next = reducer(prev, {
      type: 'WEBSOCKET/JOIN_ROOM',
      meta: { roomKey: 'thread-t1', room: 't1', type: 'thread' },
    })
    expect(next.rooms['thread-t1']).toEqual({ room: 't1', type: 'thread', status: true })
    expect(next.rooms['project-p1']).toBe(prev.rooms['project-p1'])
    expect((next as State).other).toBe(prev.other)
  })

  it('WEBSOCKET/LEAVE_ROOM sets the room status to false', () => {
    const next = reducer(prev, { type: 'WEBSOCKET/LEAVE_ROOM', meta: { roomKey: 'project-p1' } })
    expect(next.rooms['project-p1']).toEqual({ room: 'p1', type: 'project', status: false })
    expect(next.rooms['board-b1']).toBe(prev.rooms['board-b1'])
    expect((next as State).other).toBe(prev.other)
  })

  it('returns the same state when nothing changes', () => {
    const left = reducer(prev, { type: 'WEBSOCKET/LEAVE_ROOM', meta: { roomKey: 'project-p1' } })
    expect(reducer(left, { type: 'WEBSOCKET/LEAVE_ROOM', meta: { roomKey: 'project-p1' } })).toBe(left)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
