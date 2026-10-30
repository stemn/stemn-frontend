import { afterEach, describe, expect, it, vi } from 'vitest'
import manifestFixture from './__fixtures__/bracket-assembly.diff.json'
import { DiffRequestError, fetchDiff, loadDiff } from './diff.client'
import { emitDiffEvent } from './diff.events'

const request = { projectId: 'p', fileId: 'file', revisionA: 'revision-v1', revisionB: 'revision-v2', token: 'jwt' }
const respond = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('the diff client', () => {
  it('asks the diff route with the token and the room', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => respond(200, manifestFixture))
    const manifest = await fetchDiff({ ...request, roomId: 'room', force: true })
    expect(manifest.status).toBe('complete')
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/sync/diff/p/file/revision-v1/revision-v2?roomId=room&force=true',
      { headers: { Authorization: 'bearer jwt' } },
    )
  })

  it('turns API errors into DiffRequestErrors', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      respond(480, { error: { code: 480, type: 'DIFF_NOT_SUPPORTED', message: 'compare side by side' } }),
    )
    const error = await fetchDiff(request).catch((caught) => caught)
    expect(error).toBeInstanceOf(DiffRequestError)
    expect(error.error.type).toBe('DIFF_NOT_SUPPORTED')
  })

  it('waits while the diff is pending and asks again on DIFF/DIFF_COMPLETE', async () => {
    const responses = [respond(200, { status: 'pending' }), respond(200, manifestFixture)]
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => responses.shift()!)
    const onPending = vi.fn()
    const loading = loadDiff(request, { onPending, pollInterval: 60_000 })
    await vi.waitFor(() => expect(onPending).toHaveBeenCalled())

    // another diff's event is ignored
    emitDiffEvent({ type: 'complete', payload: { ...request, revisionB: 'other' } as any })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    emitDiffEvent({ type: 'complete', payload: { ...request } as any })
    expect((await loading).counts).toEqual(manifestFixture.counts)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('polls while pending in case the websocket is not connected', async () => {
    const responses = [
      respond(200, { status: 'pending' }),
      respond(200, { status: 'pending' }),
      respond(200, manifestFixture),
    ]
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => responses.shift()!)
    const manifest = await loadDiff(request, { pollInterval: 5 })
    expect(manifest.status).toBe('complete')
    expect(fetchSpy).toHaveBeenCalledTimes(3)
  })

  it('rejects on DIFF/DIFF_FAILED and on abort', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => respond(200, { status: 'pending' }))
    const failing = loadDiff(request, { pollInterval: 60_000 })
    await new Promise((resolve) => setTimeout(resolve, 0))
    emitDiffEvent({
      type: 'failed',
      payload: { ...request, error: { type: 'RENDER_FAILED', message: 'The STEP file could not be read' } } as any,
    })
    await expect(failing).rejects.toMatchObject({ error: { type: 'RENDER_FAILED' } })

    const controller = new AbortController()
    const aborted = loadDiff(request, { signal: controller.signal, pollInterval: 60_000 })
    controller.abort()
    await expect(aborted).rejects.toMatchObject({ name: 'AbortError' })
  })
})
