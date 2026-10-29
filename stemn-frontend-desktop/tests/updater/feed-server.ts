/**
 * A local generic update feed for the updater integration test: <root>/<channel>/latest-linux.yml
 * advertising a newer version, next to its "installer", served over http on 127.0.0.1.
 */
import { chmodSync, createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createServer, Server } from 'node:http'
import { AddressInfo } from 'node:net'
import { join, normalize } from 'node:path'
import { createUpdateInfo, fileEntry, stringifyUpdateInfo } from '../../scripts/release/lib/feed.mjs'

export const desktopRoot = join(__dirname, '../..')
export const qaDir = join(desktopRoot, 'qa')
export const currentVersion = (): string => JSON.parse(readFileSync(join(desktopRoot, 'package.json'), 'utf8')).version
export const appImagePath = (version = currentVersion()) =>
  join(desktopRoot, 'release', `Stemn-${version}-linux-x86_64.AppImage`)

export const NEW_VERSION = '99.0.0'
export const RELEASE_NOTES = '- Restart to update from the tray\n- Release notes from the update feed'

/**
 * The "installer" of the newer version: a script standing in for an AppImage. When the updater
 * installs it and relaunches it, it records that in $STEMN_UPDATER_TEST_MARKER.
 */
const dummyInstaller = `#!/bin/sh
# Stemn ${NEW_VERSION} (updater integration test stand-in)
echo "relaunched silent=$APPIMAGE_SILENT_INSTALL" > "$STEMN_UPDATER_TEST_MARKER"
`

export interface FeedServer {
  url: string
  requests: string[]
  close: () => Promise<void>
}

export const createFeed = async (root: string, { channel = 'stable' } = {}) => {
  const dir = join(root, 'desktop', channel)
  mkdirSync(dir, { recursive: true })
  const name = `Stemn-${NEW_VERSION}-linux-x86_64.AppImage`
  writeFileSync(join(dir, name), dummyInstaller)
  chmodSync(join(dir, name), 0o755)
  const info = createUpdateInfo({
    version: NEW_VERSION,
    files: [await fileEntry(join(dir, name), name)],
    releaseNotes: RELEASE_NOTES,
  })
  writeFileSync(join(dir, channel === 'beta' ? 'beta-linux.yml' : 'latest-linux.yml'), stringifyUpdateInfo(info))
  return { dir, name, info }
}

export const serveFeed = (root: string): Promise<FeedServer> =>
  new Promise((resolve) => {
    const requests: string[] = []
    const server: Server = createServer((request, response) => {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
      requests.push(`${request.method} ${pathname}`)
      const file = normalize(join(root, pathname))
      if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
        response.writeHead(404).end('not found')
        return
      }
      response.writeHead(200, { 'Content-Length': statSync(file).size, 'Cache-Control': 'no-cache' })
      if (request.method === 'HEAD') response.end()
      else createReadStream(file).pipe(response)
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      resolve({
        url: `http://127.0.0.1:${port}/desktop`,
        requests,
        close: () => new Promise((done) => server.close(() => done())),
      })
    })
  })

export const ensureQaDir = () => mkdirSync(qaDir, { recursive: true })
