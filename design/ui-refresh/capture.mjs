/**
 * Captures every screen of the real app in every direction and writes the review gallery's data.
 *
 *   node design/ui-refresh/capture.mjs                     everything
 *   node design/ui-refresh/capture.mjs --only=a,b --page=P03,P07
 *   node design/ui-refresh/capture.mjs --audit             also list text under 3:1 contrast (no screenshots skipped)
 *
 * Needs the local stack (stemn-backend local/start.sh + local/seed.sh) and the website on BASE_URL
 * (default http://localhost:8081, `STEMN_ENV=local npm run dev`). No app code is changed: the direction's CSS is
 * added to the page after it loads. See README.md.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import { components, directions, pages } from './catalog.mjs'
import { buildDirectionCss, moduleSelector } from './lib.mjs'

const here = import.meta.dirname
const BASE_URL = process.env.BASE_URL || 'http://localhost:8081'
const API_URL = process.env.API_URL || 'http://localhost:3000'
const VIEWPORT = { width: 1440, height: 900 }
const SCALE = 2
const WEBP_QUALITY = 0.8
/** Long feeds are cut here: WebP stops at 16383 px, and nothing new happens further down a page */
const MAX_PAGE_HEIGHT = 2600
const USER = { email: 'marcus.chen@stemn.local', password: 'password123' }
const PROJECT = 'Open Quadruped Robot'
const CAD_FILE = 'hip-bracket-assembly.step'
const FIXTURES = join(here, '../../tests/e2e/fixtures/cad')

const arg = (name) =>
  process.argv
    .find((a) => a.startsWith(`--${name}=`))
    ?.split('=')[1]
    .split(',')
const onlyDirections = arg('only')
const onlyPages = arg('page')
const AUDIT = process.argv.includes('--audit')

const api = async (path, { token, body, raw, method = body || raw ? 'POST' : 'GET' } = {}) => {
  const headers = token ? { Authorization: `bearer ${token}` } : {}
  if (raw) headers['Content-Type'] = 'application/octet-stream'
  else if (body) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: raw ? new Blob([raw]) : body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${path}: ${text.slice(0, 200)}`)
  return text ? JSON.parse(text) : undefined
}

/** Finds the demo project and uploads the shared CAD revision pair to it once, like the e2e suite does */
const demoData = async () => {
  const { token } = await api('/api/v1/auth/login', { body: USER })
  const found = await api(
    `/api/v1/search?type=project&size=100&criteria=${encodeURIComponent(JSON.stringify({ name: PROJECT }))}`,
  )
  const projectId = found.find((project) => project.name === PROJECT)?._id
  if (!projectId) throw new Error(`Seed project "${PROJECT}" not found. Run stemn-backend local/seed.sh`)
  const project = await api(`/api/v1/projects/${projectId}`, { token })
  const listing = await api(`/api/v1/sync/listFolder/${projectId}/${project.remote.root._id}`, { token })
  const entries = listing.entries || listing.files || listing
  let file = entries.find((entry) => entry.name === CAD_FILE)
  if (!file) {
    const upload = (path, raw) => api(path, { token, raw })
    const query = new URLSearchParams({ name: CAD_FILE, parentId: project.remote.root._id })
    file = await upload(
      `/api/v1/sync/upload/${projectId}?${query}`,
      readFileSync(join(FIXTURES, 'bracket-assembly-v1.step')),
    )
    await api(`/api/v1/sync/fetchRemoteChanges/${projectId}`, { token })
    await upload(
      `/api/v1/sync/upload/${projectId}/${file.fileId}`,
      readFileSync(join(FIXTURES, 'bracket-assembly-v2.step')),
    )
    await api(`/api/v1/sync/fetchRemoteChanges/${projectId}`, { token })
  }
  const threads = await api(`/api/v1/search?type=thread&parentType=project&parentId=${projectId}&size=10`, { token })
  const users = await api('/api/v1/search?type=user&size=100')
  const userId = users.find((user) => user.name === 'Marcus Chen')?._id
  return { projectId, fileId: file.fileId, threadId: threads[0]?._id, userId, token }
}

/**
 * The local database also holds throwaway e2e accounts, projects and comments. The capture hides them from what
 * the page receives (nothing is deleted), so reviewers judge the design and not `E2E comment 1793326210848`.
 */
const JUNK_NAME = /^(E2E |Smoke Test|Autodesk assembly smoke)/i
// when the e2e and desktop test runs in the local database happened
const JUNK_FROM = Date.parse('2026-10-29T00:00:00Z')
const JUNK_TO = Date.parse('2026-11-01T00:00:00Z')
const isJunk = (item) => {
  if (!item || typeof item !== 'object') return false
  if (typeof item.name === 'string' && JUNK_NAME.test(item.name)) return true
  if (typeof item.data?.project?.name === 'string' && JUNK_NAME.test(item.data.project.name)) return true
  if (!item.timestamp || !item.entityType || item.fileId) return false
  const time = Date.parse(item.timestamp)
  return time >= JUNK_FROM && time < JUNK_TO
}
const clean = (value) => {
  if (Array.isArray(value)) return value.filter((item) => !isJunk(item)).map(clean)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]))
  return value
}

const DAY = 24 * 60 * 60 * 1000
const illustrativeHistory = (from, to) =>
  Array.from({ length: Math.round((to - from) / DAY) + 1 }, (_, day) => ({
    date: new Date(from + day * DAY).toISOString().slice(0, 10),
    counts: { commit: 1 + ((day * 7) % 5), revision: 2 + ((day * 11) % 9), thread: (day * 5) % 4 },
  }))

const installRoutes = async (context) => {
  await context.route(`${API_URL}/api/v1/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    // The API rejects every /history `from` and `to` (query strings are never numbers to its validator), which is a
    // toast and an empty graph on staging, and the seed has no activity in the graph's last 20 days anyway. The
    // graph gets made-up counts, so its design can be judged with something in it.
    if (url.pathname.endsWith('/history')) {
      const range = [url.searchParams.get('from'), url.searchParams.get('to')].map((value) => Date.parse(value))
      url.searchParams.delete('from')
      url.searchParams.delete('to')
      return route.fulfill({
        response: await route.fetch({ url: url.toString() }),
        json: illustrativeHistory(...range),
      })
    }
    if (request.method() === 'OPTIONS' || url.pathname.includes('/sync/download')) return route.fallback()
    const response = await route.fetch()
    const type = response.headers()['content-type'] || ''
    if (!type.includes('json')) return route.fulfill({ response })
    const json = await response.json().catch(() => undefined)
    if (json === undefined) return route.fulfill({ response })
    return route.fulfill({ response, json: clean(json) })
  })
}

const settle = async (page, ms = 1200) => {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(ms)
}

/** How to reach each screen. Returns a promise that resolves when the screen is ready to photograph. */
const steps = (data) => {
  const project = `/project/${data.projectId}`
  const file = `/files/${data.projectId}/${data.fileId}`
  return {
    P01: { go: '/', ready: (p) => p.getByRole('heading', { name: 'Dashboard' }).waitFor() },
    P02: { go: '/explore', ready: (p) => p.locator(moduleSelector('.ProjectRow_project')).first().waitFor() },
    P03: { go: project, ready: (p) => p.locator(moduleSelector('.FileRow_row')).first().waitFor() },
    P04: {
      go: `${project}/threads`,
      ready: (p) => p.locator(moduleSelector('.ProjectThreads_thread')).first().waitFor(),
    },
    P05: {
      go: `${project}/threads/${data.threadId}`,
      ready: (p) => p.locator(moduleSelector('.Comment_comment')).first().waitFor(),
    },
    P06: { go: `${project}/history`, ready: (p) => p.locator('.recharts-surface').first().waitFor() },
    P07: { go: file, ready: (p) => p.locator('canvas').first().waitFor({ timeout: 120_000 }), wait: 5000 },
    P08: {
      go: file,
      ready: async (p) => {
        await p.locator('canvas').first().waitFor({ timeout: 120_000 })
        await p.getByTitle('Compare').click()
        await p.getByText('Compare: Unified Diff').click()
        const dots = p.locator('[data-testid="timeline-dot"]')
        await dots.first().click()
        await dots.last().click()
        await p.getByTestId('diff-view').waitFor({ timeout: 120_000 })
        await p.getByTestId('diff-entity').first().waitFor({ timeout: 120_000 })
      },
      wait: 6000,
    },
    P09: {
      go: '/notifications/all',
      ready: (p) => p.locator(moduleSelector('.NotificationItem_notification')).first().waitFor(),
    },
    P10: { go: '/settings', ready: (p) => p.locator(moduleSelector('.NavPillContainer_root')).first().waitFor() },
    P11: { go: `/users/${data.userId}`, ready: (p) => p.locator('.react-calendar-heatmap').first().waitFor() },
    P12: { go: '/login', anonymous: true, ready: (p) => p.getByPlaceholder('Email').waitFor() },
    P13: { go: `${project}/pipelines`, ready: (p) => p.getByText('Project Pipelines').first().waitFor() },
    S01: {
      go: '/',
      ready: async (p) => {
        await p.getByRole('heading', { name: 'Dashboard' }).waitFor()
        await p.getByRole('button', { name: /Feed: / }).click()
        await p.locator('.Popover-body').first().waitFor()
      },
    },
    S02: {
      go: '/',
      ready: async (p) => {
        await p.getByRole('heading', { name: 'Dashboard' }).waitFor()
        await p.locator('[data-tag="create-project"]').click()
        await p.locator(moduleSelector('.Modal_modal')).first().waitFor()
      },
    },
    // A real toast: a preview of the file with a revision the backend cannot find
    S03: {
      go: `${file}?revision=000000000000000000000000`,
      ready: (p) => p.locator(moduleSelector('.Toasts-web_toast')).first().waitFor({ timeout: 30_000 }),
      wait: 300,
    },
  }
}

const boxesOf = (page, list) =>
  page.evaluate(
    (components) => {
      const out = {}
      for (const { id, selectors, pad } of components) {
        const rects = selectors
          .map((selector) => {
            const visible = [...document.querySelectorAll(selector)].filter((element) => {
              const rect = element.getBoundingClientRect()
              const style = getComputedStyle(element)
              return rect.width > 4 && rect.height > 4 && style.visibility !== 'hidden' && style.display !== 'none'
            })
            return visible[0]?.getBoundingClientRect()
          })
          .filter(Boolean)
        if (!rects.length) continue
        const x = Math.min(...rects.map((r) => r.left)) + window.scrollX
        const y = Math.min(...rects.map((r) => r.top)) + window.scrollY
        const right = Math.max(...rects.map((r) => r.right)) + window.scrollX
        const bottom = Math.max(...rects.map((r) => r.bottom)) + window.scrollY
        out[id] = [x - pad, y - pad, right - x + 2 * pad, bottom - y + 2 * pad].map((n) => Math.round(n))
      }
      return out
    },
    list.map(({ id, sel }) => ({ id, pad: 10, selectors: sel.map(moduleSelector) })),
  )

/** Text whose colour against its effective background is under 3:1, the check a stylesheet this broad needs */
const lowContrast = (page) =>
  page.evaluate(() => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/)
      if (!match) return [0, 0, 0, 0]
      const parts = match[1]
        .split(/[\s,/]+/)
        .filter(Boolean)
        .map(Number)
      return [parts[0], parts[1], parts[2], parts[3] ?? 1]
    }
    const over = (top, bottom) => {
      const a = top[3] + bottom[3] * (1 - top[3])
      if (!a) return [0, 0, 0, 0]
      return [0, 1, 2].map((i) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a).concat(a)
    }
    const backdrop = (element) => {
      const layers = []
      for (let node = element; node; node = node.parentElement) {
        const style = getComputedStyle(node)
        if (style.backgroundImage !== 'none') return null
        const color = parse(style.backgroundColor)
        if (color[3] > 0) layers.push(color)
        if (color[3] === 1) break
      }
      return layers.reduceRight((below, layer) => over(layer, below), [255, 255, 255, 1])
    }
    const luminance = ([r, g, b]) => {
      const channel = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    }
    const found = new Map()
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim()
      const element = walker.currentNode.parentElement
      if (!text || !element || ['SCRIPT', 'STYLE'].includes(element.tagName)) continue
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      if (!rect.width || !rect.height || style.visibility === 'hidden' || Number(style.opacity) === 0) continue
      const back = backdrop(element)
      if (!back) continue
      const front = over(parse(style.color), back)
      const [a, b] = [luminance(front), luminance(back)].sort((x, y) => y - x)
      const ratio = (a + 0.05) / (b + 0.05)
      if (ratio >= 3) continue
      const owner = element.closest('[class*="_"]')
      const name = `${owner?.className
        ?.toString()
        .split(' ')[0]
        .replace(/-[\w-]{5}$/, '')}`
      if (!found.has(name)) found.set(name, `${ratio.toFixed(1)} ${name} "${text.slice(0, 28)}"`)
    }
    return [...found.values()]
  })

const toWebp = async (encoder, png) =>
  Buffer.from(
    await encoder.evaluate(
      async ([base64, quality]) => {
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d').drawImage(image, 0, 0)
        return canvas.toDataURL('image/webp', quality).split(',')[1]
      },
      [png.toString('base64'), WEBP_QUALITY],
    ),
    'base64',
  )

const manifestPath = join(here, 'gallery/manifest.js')
const loadBoxes = () => {
  if (!existsSync(manifestPath)) return {}
  return JSON.parse(
    readFileSync(manifestPath, 'utf8')
      .replace(/^window\.MANIFEST = /, '')
      .replace(/;\s*$/, ''),
  ).boxes
}
const saveManifest = (boxes) => {
  const manifest = {
    viewport: VIEWPORT,
    directions,
    pages,
    components: components.map(({ id, group, name, page, note, maxHeight }) => ({
      id,
      group,
      name,
      page,
      note,
      maxHeight,
    })),
    boxes,
  }
  writeFileSync(manifestPath, `window.MANIFEST = ${JSON.stringify(manifest)};\n`)
}

const main = async () => {
  const data = await demoData()
  console.log('demo data', data.projectId, data.fileId, data.threadId, data.userId)
  const flow = steps(data)
  const browser = await chromium.launch({
    args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  })
  const encoder = await browser.newPage()

  const loginContext = await browser.newContext({ viewport: VIEWPORT })
  const loginPage = await loginContext.newPage()
  await loginPage.goto(`${BASE_URL}/login`)
  await loginPage.getByPlaceholder('Email').fill(USER.email)
  await loginPage.getByPlaceholder('Password').fill(USER.password)
  await loginPage.getByRole('button', { name: 'Sign In' }).click()
  await loginPage.getByRole('heading', { name: 'Dashboard' }).waitFor({ timeout: 30_000 })
  const storageState = await loginContext.storageState()
  await loginContext.close()

  const boxes = loadBoxes()
  const failures = []
  for (const direction of directions) {
    if (onlyDirections && !onlyDirections.includes(direction.id)) continue
    const css = buildDirectionCss(here, direction.id)
    const outDir = join(here, 'gallery/shots', direction.id)
    mkdirSync(outDir, { recursive: true })
    boxes[direction.id] ||= {}
    for (const screen of pages) {
      if (onlyPages && !onlyPages.includes(screen.id)) continue
      const step = flow[screen.id]
      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: SCALE,
        storageState: step.anonymous ? undefined : storageState,
      })
      await installRoutes(context)
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      try {
        await page.goto(`${BASE_URL}${step.go}`)
        // The style goes after <head> so stylesheets that lazy routes add later still come before it
        if (css) {
          await page.evaluate(
            ([text, id]) => {
              const style = document.createElement('style')
              style.textContent = text
              document.documentElement.dataset.direction = id
              document.documentElement.appendChild(style)
            },
            [css, direction.id],
          )
        }
        await step.ready(page)
        if (screen.id !== 'S01') await page.mouse.move(2, 500)
        await settle(page, step.wait)
        const list = components.filter((component) => component.page === screen.id)
        const found = await boxesOf(page, list)
        const size = await page.evaluate(() => ({
          w: document.documentElement.clientWidth,
          h: document.documentElement.scrollHeight,
        }))
        const height = screen.viewportOnly ? VIEWPORT.height : Math.min(size.h, MAX_PAGE_HEIGHT)
        const png = await page.screenshot({
          fullPage: !screen.viewportOnly,
          clip: { x: 0, y: 0, width: VIEWPORT.width, height },
          animations: 'disabled',
        })
        writeFileSync(join(outDir, `${screen.id}.webp`), await toWebp(encoder, png))
        boxes[direction.id][screen.id] = { size: { w: VIEWPORT.width, h: height }, components: found }
        if (AUDIT)
          for (const line of await lowContrast(page))
            console.log(`  low contrast ${direction.id} ${screen.id}: ${line}`)
        const missing = list.filter((component) => !found[component.id]).map((component) => component.id)
        console.log(
          `${direction.id} ${screen.id} ok${missing.length ? ` MISSING ${missing}` : ''}${errors.length ? ` ERRORS ${errors[0]}` : ''}`,
        )
      } catch (error) {
        failures.push(`${direction.id} ${screen.id}: ${error.message.split('\n')[0]}`)
        console.log(`${direction.id} ${screen.id} FAILED ${error.message.split('\n')[0]}`)
        await page.screenshot({ path: join(here, `.fail-${direction.id}-${screen.id}.png`) }).catch(() => {})
      }
      await context.close()
    }
    saveManifest(boxes)
  }
  await browser.close()
  if (failures.length) {
    console.error(`\n${failures.length} failed:\n${failures.join('\n')}`)
    process.exitCode = 1
  }
}

await main()
