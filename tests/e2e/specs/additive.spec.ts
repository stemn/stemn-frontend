import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's additive samples, two revisions each with one change of every class (see fixtures/additive/README.md)
const fixture = (name: string) => readFileSync(join(__dirname, '../fixtures/additive', name))

// the diff viewer's class accents (stemn-frontend-shared/src/misc/FileDiff/diff.utils.ts), as hues in degrees
const accentHues = { added: 141, removed: 2, modified: 40, moved: 215 }

/** What a canvas draws: the share of covered pixels, a fingerprint, and the pixels of each accent hue */
const canvasPixels = (canvas: Locator) =>
  canvas.evaluate((element: HTMLCanvasElement, hues: Record<string, number>) => {
    const copy = document.createElement('canvas')
    copy.width = element.width
    copy.height = element.height
    const context = copy.getContext('2d')!
    context.drawImage(element, 0, 0)
    const { data } = context.getImageData(0, 0, copy.width, copy.height)
    const accents: Record<string, number> = Object.fromEntries(Object.keys(hues).map((name) => [name, 0]))
    let covered = 0
    let fingerprint = 0
    for (let index = 0; index < data.length; index += 4) {
      const [r, g, b, alpha] = [data[index] / 255, data[index + 1] / 255, data[index + 2] / 255, data[index + 3]]
      if (alpha === 0) continue
      covered++
      fingerprint = (fingerprint * 31 + data[index] + data[index + 1] * 7 + data[index + 2] * 13) % 1_000_000_007
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max === 0 || (max - min) / max < 0.2) continue
      const hue =
        max === r
          ? (60 * ((g - b) / (max - min)) + 360) % 360
          : max === g
            ? 60 * ((b - r) / (max - min)) + 120
            : 60 * ((r - g) / (max - min)) + 240
      const nearest = Object.entries(hues).sort(
        ([, x], [, y]) =>
          Math.min(Math.abs(hue - x), 360 - Math.abs(hue - x)) - Math.min(Math.abs(hue - y), 360 - Math.abs(hue - y)),
      )[0]
      const distance = Math.min(Math.abs(hue - nearest[1]), 360 - Math.abs(hue - nearest[1]))
      if (distance < 18) accents[nearest[0]]++
    }
    return { covered: covered / (copy.width * copy.height), fingerprint, accents }
  }, accentHues)

/** Uploads the samples as revisions of one file in the CubeSat project, as the project owner */
const uploadRevisions = async (page: Page, samples: string[], extension: string) => {
  await loginThroughForm(page, seedUsers.priya.email)
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
  const projectId = new URL(page.url()).pathname.split('/')[2]

  const token = await login(seedUsers.priya.email)
  const project = await api.get(`/api/v1/projects/${projectId}`, token)
  const name = `e2e-additive-${Date.now().toString(36)}.${extension}`
  const file = await api.request('POST', `/api/v1/sync/upload/${projectId}`, {
    token,
    raw: fixture(samples[0]),
    query: { name, parentId: project.remote.root._id },
  })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  const revisions = [file.revisionId]
  for (const sample of samples.slice(1)) {
    const revision = await api.request('POST', `/api/v1/sync/upload/${projectId}/${file.fileId}`, {
      token,
      raw: fixture(sample),
    })
    await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
    revisions.push(revision.revisionId)
  }
  return { projectId, fileId: file.fileId, name, revisions }
}

/** Opens the unified diff of the file's two revisions from the compare menu and the timeline */
const openUnifiedDiff = async (page: Page, upload: Awaited<ReturnType<typeof uploadRevisions>>) => {
  await page.goto(`/files/${upload.projectId}/${upload.fileId}`)
  await expect(page).toHaveTitle(`${seedData.project} - ${upload.name}`)
  await page.getByTitle('Compare').click()
  await page.getByText('Compare: Unified Diff').click()
  await page.locator(`[data-testid="timeline-dot"][data-revision-id="${upload.revisions[0]}"]`).click()
  await page.locator(`[data-testid="timeline-dot"][data-revision-id="${upload.revisions[1]}"]`).click()
  const view = page.getByTestId('diff-view')
  await expect(view).toBeVisible({ timeout: 120_000 })
  await expect(view).toHaveAttribute('data-view', 'unified')
  return view
}

const expectCounts = async (page: Page, counts: Record<string, string>) => {
  for (const [diffClass, count] of Object.entries(counts)) {
    await expect(page.getByTestId(`diff-count-${diffClass}`)).toHaveText(count)
  }
}

const rowClasses = (page: Page) =>
  page.getByTestId('diff-entity').evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.class))

test.describe('additive manufacturing: the G-code layer viewer and the 3MF and G-code diffs', () => {
  // conversions and the first three.js chunk load take a while on a cold backend
  test.setTimeout(180_000)

  test('a G-code file opens in the layer viewer: features, layer slider and travel', async ({ page }) => {
    const { projectId, fileId, name } = await uploadRevisions(page, ['tube-v1.gcode'], 'gcode')

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    const viewer = page.getByTestId('gcode-viewer')
    await expect(viewer).toBeVisible({ timeout: 90_000 })
    await expect(page.getByTestId('gcode-status')).toHaveText('PrusaSlicer · 10 layers · 468 moves', {
      timeout: 30_000,
    })
    await expect(page.getByTestId('gcode-legend').locator('[data-feature]')).toHaveText([
      'Custom',
      'Outer wall',
      'Inner wall',
      'Skirt',
    ])

    // the toolpath is drawn in its features' colours
    const canvas = page.getByTestId('gcode-canvas').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvas)).covered, { timeout: 30_000 }).toBeGreaterThan(0.002)
    const all = await canvasPixels(canvas)

    // down to the first layer, then travel on: the drawing changes each time
    await expect(page.getByTestId('gcode-layer')).toHaveText('Layer 10 of 10 · z 2.00 mm')
    await page.getByTestId('gcode-layer-slider').fill('0')
    await expect(page.getByTestId('gcode-layer')).toHaveText('Layer 1 of 10 · z 0.20 mm')
    await expect.poll(async () => (await canvasPixels(canvas)).fingerprint).not.toBe(all.fingerprint)
    const firstLayer = await canvasPixels(canvas)
    await page.getByTestId('gcode-travel').click()
    await expect(page.getByTestId('gcode-travel')).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(async () => (await canvasPixels(canvas)).fingerprint).not.toBe(firstLayer.fingerprint)
  })

  test('two revisions of a G-code file: layers by class, the moves only one revision extrudes, side by side', async ({
    page,
  }) => {
    const upload = await uploadRevisions(page, ['tube-v1.gcode', 'tube-v2.gcode'], 'gcode')
    await openUnifiedDiff(page, upload)

    // one layer of each class, seven unchanged (samples.json)
    await expectCounts(page, { added: '1', removed: '1', modified: '1', moved: '1', unchanged: '7' })
    await expect(page.getByTestId('diff-entity')).toHaveCount(4)
    await expect.poll(() => rowClasses(page)).toEqual(['added', 'removed', 'modified', 'moved'])
    await expect(page.locator('[data-testid="diff-entity"][data-class="added"]')).toHaveText(/Layer 10 · z 2\.20 mm/)

    // every change accent is on the canvas; layers hide the ones below them, so with "changes only" (the removed layer is
    // drawn at 30% between the others)
    const canvas = page.getByTestId('diff-canvas').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvas)).covered, { timeout: 30_000 }).toBeGreaterThan(0.002)
    const everything = await canvasPixels(canvas)
    await page.keyboard.press('c')
    await expect(page.getByTestId('diff-changes-only')).toBeChecked()
    await expect.poll(async () => (await canvasPixels(canvas)).fingerprint).not.toBe(everything.fingerprint)
    const drawn = await canvasPixels(canvas)
    for (const diffClass of Object.keys(accentHues)) {
      expect(drawn.accents[diffClass], `${diffClass} pixels`).toBeGreaterThan(20)
    }
    await page.keyboard.press('c')

    // the moved layer moved 1.5 mm; the modified one has 11 moves only in B (its new solid infill)
    await page.locator('[data-testid="diff-entity"][data-class="moved"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 1.5 mm')
    await page.locator('[data-testid="diff-entity"][data-class="modified"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Modified')
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="segments"]')).toContainText('+11')
    const comparison = page.getByTestId('gcode-diff-comparison')
    await expect(comparison).toHaveAttribute('data-b-only', '11')
    await expect(comparison).toHaveAttribute('data-a-only', '0')
    await expect(comparison).toContainText('11 moves only in B')

    // the layer slider hides the layers above a height
    const before = await canvasPixels(canvas)
    await page.getByTestId('gcode-diff-layer-slider').fill('0')
    await expect(page.getByTestId('gcode-diff-height')).toHaveText('Up to z 0.20 mm')
    await expect.poll(async () => (await canvasPixels(canvas)).fingerprint).not.toBe(before.fingerprint)
    await page.getByTestId('gcode-diff-layer-slider').fill('10')

    // side by side, with the cameras linked
    await page.keyboard.press('s')
    await expect(page.getByTestId('diff-view')).toHaveAttribute('data-view', 'sideBySide')
    const canvasA = page.getByTestId('diff-canvas-a').locator('canvas')
    const canvasB = page.getByTestId('diff-canvas-b').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvasA)).covered, { timeout: 30_000 }).toBeGreaterThan(0.001)
    await expect.poll(async () => (await canvasPixels(canvasB)).covered).toBeGreaterThan(0.001)
    const right = await canvasPixels(canvasB)
    const box = (await canvasA.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 40, { steps: 8 })
    await page.mouse.up()
    await expect.poll(async () => (await canvasPixels(canvasB)).fingerprint).not.toBe(right.fingerprint)
  })

  test('two revisions of a 3MF plate: build items by class, with their materials', async ({ page }) => {
    const upload = await uploadRevisions(page, ['parts-v1.3mf', 'parts-v2.3mf'], '3mf')
    await openUnifiedDiff(page, upload)

    await expectCounts(page, { added: '1', removed: '1', modified: '1', moved: '1', unchanged: '4' })
    await expect.poll(() => rowClasses(page)).toEqual(['added', 'removed', 'modified', 'moved'])
    await expect(page.getByTestId('diff-entity')).toHaveText([/lid/, /pin/, /knob/, /spacer/])

    const canvas = page.getByTestId('diff-canvas').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvas)).covered, { timeout: 30_000 }).toBeGreaterThan(0.01)
    const drawn = await canvasPixels(canvas)
    for (const diffClass of Object.keys(accentHues)) {
      expect(drawn.accents[diffClass], `${diffClass} pixels`).toBeGreaterThan(30)
    }

    // the spacer's build item moved 30 mm; the knob was meshed finer and keeps its colour
    await page.locator('[data-testid="diff-entity"][data-entity-id="spacer"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 30 mm')
    await expect(page.getByTestId('diff-entity-material')).toHaveText('PLA Blue')
    await page.locator('[data-testid="diff-entity"][data-entity-id="knob"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Modified')
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="triangles"]')).toContainText('+64')
    await expect(page.getByTestId('diff-entity-material')).toHaveText('#E8A317')

    // the unchanged items, the two feet as one object placed twice
    await page.keyboard.press('5')
    await expect(page.getByTestId('diff-entity')).toHaveCount(8)
    await page.locator('[data-testid="diff-entity"][data-entity-id="base"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Unchanged')
    await expect(page.getByTestId('diff-entity-material')).toHaveText('PLA Grey')
    await expect(page.locator('[data-testid="diff-entity"][data-entity-id="foot#2"]')).toBeVisible()
  })
})
