/**
 * `stemn-file://cache/<path>` serves files from the FileCache folder
 * (<userData>/FileCache) to the renderers, e.g. downloaded PDFs and renders
 * for the previews. Renderers run with webSecurity on, so they can't load
 * file:// urls from the dev server, and pdf.js can't fetch file:// at all.
 * Only files inside the cache folder are served.
 */
import { app, net, protocol } from 'electron'
import { join, relative, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'

export const SCHEME = 'stemn-file'

export const getCacheFolder = () => join(app.getPath('userData'), 'FileCache')

/** Must run before the app is ready */
export const registerSchemes = () => {
  protocol.registerSchemesAsPrivileged([{
    scheme: SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
  }])
}

/** Url for a path relative to the cache folder */
export const toCacheUrl = relativePath => `${SCHEME}://cache/${relativePath.split(/[\\/]/).map(encodeURIComponent).join('/')}`

export const registerProtocolHandlers = () => {
  protocol.handle(SCHEME, async (request) => {
    const url = new URL(request.url)
    const folder = getCacheFolder()
    const filePath = join(folder, ...url.pathname.split('/').filter(Boolean).map(decodeURIComponent))
    const relativePath = relative(folder, filePath)
    if (url.host !== 'cache' || !relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) {
      return new Response('Not found', { status: 404 })
    }
    const response = await net.fetch(pathToFileURL(filePath).href)
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    return new Response(response.body, { status: response.status, headers })
  })
}
