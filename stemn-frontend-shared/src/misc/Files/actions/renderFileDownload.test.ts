import { describe, expect, it } from 'vitest'
import { renderFileDownload as renderFileDownloadDesktop } from './renderFileDownload.desktop'
import { renderFileDownload } from './renderFileDownload.web'

const render = { projectId: 'project1', fileId: 'file1', revisionId: 'rev1', provider: 'stemn', timestamp: '' }

describe('renderFileDownload', () => {
  it('stores the render address and the CAD provider on the website', () => {
    expect(renderFileDownload({ ...render, cadProvider: 'opencascade' })).toEqual({
      type: 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED',
      payload: {
        data: 'http://localhost:3000/api/v1/sync/downloadRenderFile/project1/file1/rev1',
        cadProvider: 'opencascade',
      },
      meta: { cacheKey: 'file1-rev1' },
    })
  })

  it('downloads and extracts Autodesk renders through the desktop file cache', () => {
    const action: any = renderFileDownloadDesktop(render)
    expect(action.type).toBe('FILES/RENDER_FILE_DOWNLOAD')
    expect(action.payload.functionInputs).toMatchObject({
      extract: true,
      url: '/api/v1/sync/downloadRender/project1/file1/rev1',
    })
  })

  it('does not put open-source renders through the desktop file cache (a glb, not a zip)', () => {
    expect(renderFileDownloadDesktop({ ...render, cadProvider: 'opencascade' })).toEqual(
      renderFileDownload({ ...render, cadProvider: 'opencascade' }),
    )
  })
})
