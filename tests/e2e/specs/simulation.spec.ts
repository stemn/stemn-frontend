import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's simulation pair: one block of each class, and fields that change by known amounts (fixtures/simulation)
const V1 = readFileSync(join(__dirname, '../fixtures/simulation/manifold-v1.vtk'))
const V2 = readFileSync(join(__dirname, '../fixtures/simulation/manifold-v2.vtk'))
const INLET = readFileSync(join(__dirname, '../fixtures/simulation/inlet.vtu'))

// the diff classes' accents (diff.utils), and the ends of the delta colour map (simulation.utils), as hues in degrees
const classHues = { added: 141, removed: 2, modified: 40, moved: 215 }
const deltaHues = { less: 230, more: 350 }

/** The share of the canvas covered, a fingerprint, and the pixels near each hue */
const canvasPixels = (canvas: Locator, hues: Record<string, number>) =>
  canvas.evaluate((element: HTMLCanvasElement, wanted: Record<string, number>) => {
    const copy = document.createElement('canvas')
    copy.width = element.width
    copy.height = element.height
    const context = copy.getContext('2d')!
    context.drawImage(element, 0, 0)
    const { data } = context.getImageData(0, 0, copy.width, copy.height)
    const counts: Record<string, number> = Object.fromEntries(Object.keys(wanted).map((name) => [name, 0]))
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
      const distance = (target: number) => Math.min(Math.abs(hue - target), 360 - Math.abs(hue - target))
      const nearest = Object.entries(wanted).sort(([, x], [, y]) => distance(x) - distance(y))[0]
      if (distance(nearest[1]) < 18) counts[nearest[0]]++
    }
    return { covered: covered / (copy.width * copy.height), fingerprint, counts }
  }, hues)

/** Uploads a file to the CubeSat project, and more revisions of it, as the project owner */
const uploadRevisions = async (page: Page, extension: string, revisions: Buffer[]) => {
  await loginThroughForm(page, seedUsers.priya.email)
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
  const projectId = new URL(page.url()).pathname.split('/')[2]

  const token = await login(seedUsers.priya.email)
  const project = await api.get(`/api/v1/projects/${projectId}`, token)
  const name = `e2e-simulation-${Date.now().toString(36)}.${extension}`
  const file = await api.request('POST', `/api/v1/sync/upload/${projectId}`, {
    token,
    raw: revisions[0],
    query: { name, parentId: project.remote.root._id },
  })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  const ids = [file.revisionId]
  for (const data of revisions.slice(1)) {
    const revision = await api.request('POST', `/api/v1/sync/upload/${projectId}/${file.fileId}`, { token, raw: data })
    await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
    ids.push(revision.revisionId)
  }
  return { projectId, fileId: file.fileId, name, revisions: ids }
}

test.describe('Simulation results (VTK): preview and the diff with field deltas', () => {
  // conversions and the first vtk.js chunk load take a while on a cold backend
  test.setTimeout(180_000)

  test('a VTK XML file previews with vtk.js, coloured by a field with a legend', async ({ page }) => {
    const { projectId, fileId, name } = await uploadRevisions(page, 'vtu', [INLET])

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    const preview = page.getByTestId('simulation-preview')
    await expect(preview).toBeVisible({ timeout: 120_000 })
    await expect(page.getByTestId('simulation-summary')).toHaveText('1 block, 8 cells, 27 points')

    const canvas = page.getByTestId('simulation-canvas').locator('canvas')
    await expect
      .poll(async () => (await canvasPixels(canvas, classHues)).covered, { timeout: 30_000 })
      .toBeGreaterThan(0.02)
    const blocks = await canvasPixels(canvas, classHues)

    // the pressure p: 0 to 7 over the surface
    await page.getByTestId('simulation-field').selectOption('p')
    await expect(page.getByTestId('simulation-legend-title')).toHaveText('p')
    await expect(page.getByTestId('simulation-legend-min')).toHaveText('0')
    await expect(page.getByTestId('simulation-legend-max')).toHaveText('7')
    await expect.poll(async () => (await canvasPixels(canvas, classHues)).fingerprint).not.toBe(blocks.fingerprint)
  })

  test('two revisions show the block classes, the entity panel, and B - A with its legend and range controls', async ({
    page,
  }) => {
    const { projectId, fileId, name, revisions } = await uploadRevisions(page, 'vtk', [V1, V2])
    const [revisionA, revisionB] = revisions

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    await page.getByTitle('Compare').click()
    await page.getByText('Compare: Unified Diff').click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionA}"]`).click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionB}"]`).click()

    const view = page.getByTestId('diff-view')
    await expect(view).toBeVisible({ timeout: 120_000 })
    await expect(view).toHaveAttribute('data-view', 'unified')

    // the counts of the backend's manifest on the filter toggles
    const counts = { added: '1', removed: '1', modified: '1', moved: '1', unchanged: '2' }
    for (const [diffClass, count] of Object.entries(counts)) {
      await expect(page.getByTestId(`diff-count-${diffClass}`)).toHaveText(count)
    }

    // the entity panel: the changed blocks by class, the unchanged ones once their filter is on
    const rows = page.getByTestId('diff-entity')
    await expect(rows).toHaveCount(4)
    await expect
      .poll(() => rows.evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.entityId)))
      .toEqual(['probe', 'baffle', 'body', 'outlet'])
    await expect
      .poll(() => rows.evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.class)))
      .toEqual(['added', 'removed', 'modified', 'moved'])
    await page.keyboard.press('5')
    await expect(rows).toHaveCount(6)

    // the canvas draws the blocks, with every class accent on screen
    const canvas = page.getByTestId('diff-canvas').locator('canvas')
    await expect
      .poll(async () => (await canvasPixels(canvas, classHues)).covered, { timeout: 30_000 })
      .toBeGreaterThan(0.02)
    await expect
      .poll(async () => {
        const { counts: drawn } = await canvasPixels(canvas, classHues)
        return Object.keys(classHues).filter((diffClass) => drawn[diffClass] <= 30)
      })
      .toEqual([])

    // the moved outlet, and the inlet whose fields changed on the same cells
    await page.locator('[data-testid="diff-entity"][data-entity-id="outlet"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 0.5')
    await page.locator('[data-testid="diff-entity"][data-entity-id="inlet"]').click()
    await expect(page.getByTestId('simulation-topology')).toHaveAttribute('data-topology', 'same')
    await expect(page.locator('[data-testid="simulation-field-delta"][data-field="p"]')).toHaveText(
      'Δ p -0.25 … +0.5, mean +0.1111, RMS 0.2966, 20 of 27 points changed',
    )
    await expect(page.locator('[data-testid="simulation-field-delta"][data-field="U"]')).toHaveText(
      'Δ U 0 … +0.5, mean +0.2188, RMS 0.2932, 5 of 8 cells changed',
    )
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="field:p"]')).toContainText('-0.25 … +0.5')

    // the re-meshed body: its fields are not compared value by value, and the panel says so
    await page.locator('[data-testid="diff-entity"][data-entity-id="body"]').click()
    await expect(page.getByTestId('simulation-topology')).toHaveAttribute('data-topology', 'different')

    // the field delta mode: B - A of p, symmetric about zero up to the outlet's -1
    const classes = await canvasPixels(canvas, classHues)
    await page.getByTestId('simulation-mode-delta').click()
    await expect(view).toHaveAttribute('data-colour-mode', 'delta')
    await expect(page.getByTestId('simulation-field')).toHaveValue('p')
    await expect(page.getByTestId('simulation-legend-title')).toHaveText('Δ p (B − A)')
    await expect(page.getByTestId('simulation-legend-min')).toHaveText('-1')
    await expect(page.getByTestId('simulation-legend-max')).toHaveText('+1')
    await expect(page.getByTestId('simulation-topology-notice')).toContainText('body was meshed again')
    await expect.poll(async () => (await canvasPixels(canvas, deltaHues)).fingerprint).not.toBe(classes.fingerprint)
    // the outlet is 1 lower everywhere: the blue end of the map
    await expect.poll(async () => (await canvasPixels(canvas, deltaHues)).counts.less).toBeGreaterThan(30)

    // the velocity: 0 to 0.5 on the inlet, so ±0.5; then a range set by hand, and inverted
    await page.getByTestId('simulation-field').selectOption('U')
    await expect(page.getByTestId('simulation-legend-min')).toHaveText('-0.5')
    await expect(page.getByTestId('simulation-legend-max')).toHaveText('+0.5')
    await page.getByTestId('simulation-range-auto').uncheck()
    await page.getByTestId('simulation-range-limit').fill('2')
    await expect(page.getByTestId('simulation-legend-max')).toHaveText('+2')
    await page.getByTestId('simulation-invert').check()
    await expect(page.getByTestId('simulation-invert')).toBeChecked()

    // the field in B, on one range for A and B
    await page.getByTestId('simulation-field').selectOption('p')
    await page.getByTestId('simulation-range-auto').check()
    await page.getByTestId('simulation-mode-b').click()
    await expect(page.getByTestId('simulation-legend-title')).toHaveText('p in B')
    await expect(page.getByTestId('simulation-legend-min')).toHaveText('-1')
    await expect(page.getByTestId('simulation-legend-max')).toHaveText('13.25')

    // side by side: A and B in two panes whose cameras move together
    await page.getByTestId('simulation-mode-classes').click()
    await page.getByTestId('diff-view-side-by-side').click()
    await expect(view).toHaveAttribute('data-view', 'sideBySide')
    const canvasA = page.getByTestId('diff-canvas-a').locator('canvas')
    const canvasB = page.getByTestId('diff-canvas-b').locator('canvas')
    await expect
      .poll(async () => (await canvasPixels(canvasA, classHues)).covered, { timeout: 30_000 })
      .toBeGreaterThan(0.01)
    await expect.poll(async () => (await canvasPixels(canvasB, classHues)).covered).toBeGreaterThan(0.01)
    const before = await canvasPixels(canvasB, classHues)
    const box = (await canvasA.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 40, { steps: 8 })
    await page.mouse.up()
    await expect.poll(async () => (await canvasPixels(canvasB, classHues)).fingerprint).not.toBe(before.fingerprint)

    await page.keyboard.press('u')
    await expect(view).toHaveAttribute('data-view', 'unified')
  })
})
