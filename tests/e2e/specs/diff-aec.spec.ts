import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's civil and architecture pairs: one entity of each class (see fixtures/aec/README.md)
const fixture = (name: string) => readFileSync(join(__dirname, '../fixtures/aec', name))

// the diff viewer's class accents (stemn-frontend-shared/src/misc/FileDiff/diff.utils.ts)
const accents = {
  added: 'rgb(47, 158, 88)',
  removed: 'rgb(214, 69, 65)',
  modified: 'rgb(232, 163, 23)',
  moved: 'rgb(58, 123, 213)',
  unchanged: 'rgb(167, 173, 181)',
}
const accentHues = { added: 141, removed: 2, modified: 40, moved: 215 }

/** The pixels of a canvas in each accent hue, and the share it covers */
const canvasPixels = (canvas: Locator) =>
  canvas.evaluate((element: HTMLCanvasElement, hues: Record<string, number>) => {
    const copy = document.createElement('canvas')
    copy.width = element.width
    copy.height = element.height
    const context = copy.getContext('2d')!
    context.drawImage(element, 0, 0)
    const { data } = context.getImageData(0, 0, copy.width, copy.height)
    const found: Record<string, number> = Object.fromEntries(Object.keys(hues).map((name) => [name, 0]))
    let covered = 0
    for (let index = 0; index < data.length; index += 4) {
      const [r, g, b, alpha] = [data[index] / 255, data[index + 1] / 255, data[index + 2] / 255, data[index + 3]]
      if (alpha === 0) continue
      covered++
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max === 0 || (max - min) / max < 0.2) continue
      const hue =
        max === r
          ? (60 * ((g - b) / (max - min)) + 360) % 360
          : max === g
            ? 60 * ((b - r) / (max - min)) + 120
            : 60 * ((r - g) / (max - min)) + 240
      for (const [name, target] of Object.entries(hues)) {
        if (Math.min(Math.abs(hue - target), 360 - Math.abs(hue - target)) < 18) found[name]++
      }
    }
    return { covered: covered / (copy.width * copy.height), accents: found }
  }, accentHues)

/** Logs in as the CubeSat project's owner and opens the project: its id */
const openProject = async (page: Page) => {
  await loginThroughForm(page, seedUsers.priya.email)
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
  return new URL(page.url()).pathname.split('/')[2]
}

/** Uploads revision A to the project and B as its second revision, as the project owner */
const uploadRevisions = async (projectId: string, extension: string, [a, b]: Buffer[]) => {
  const token = await login(seedUsers.priya.email)
  const project = await api.get(`/api/v1/projects/${projectId}`, token)
  const name = `e2e-diff-${Date.now().toString(36)}.${extension}`
  const file = await api.request('POST', `/api/v1/sync/upload/${projectId}`, {
    token,
    raw: a,
    query: { name, parentId: project.remote.root._id },
  })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  const revision = await api.request('POST', `/api/v1/sync/upload/${projectId}/${file.fileId}`, { token, raw: b })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  expect(revision.revisionId).not.toBe(file.revisionId)
  return { projectId, fileId: file.fileId, name, revisionA: file.revisionId, revisionB: revision.revisionId }
}

/** Opens the file, picks Compare: Unified Diff and the two revisions on the timeline */
const openUnifiedDiff = async (page: Page, { projectId, fileId, name, revisionA, revisionB }: any) => {
  await page.goto(`/files/${projectId}/${fileId}`)
  await expect(page).toHaveTitle(`${seedData.project} - ${name}`)
  await page.getByTitle('Compare').click()
  await page.getByText('Compare: Unified Diff').click()
  await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionA}"]`).click()
  await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionB}"]`).click()
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

const rowClasses = (rows: Locator) =>
  rows.evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.class))

test.describe('civil and architecture diffs (IFC models, DXF drawings)', () => {
  // two conversions and the first viewer chunk load take a while on a cold backend
  test.setTimeout(180_000)

  test('two revisions of an IFC building: classes, colours, the property panel and the storey filter', async ({
    page,
  }) => {
    const files = await uploadRevisions(await openProject(page), 'ifc', [
      fixture('building-v1.ifc'),
      fixture('building-v2.ifc'),
    ])
    await openUnifiedDiff(page, files)

    // the counts of the backend's aec manifest
    await expectCounts(page, { added: '1', removed: '1', modified: '1', moved: '1', unchanged: '9' })
    const rows = page.getByTestId('diff-entity')
    await expect(rows).toHaveCount(4)
    await expect.poll(() => rowClasses(rows)).toEqual(['added', 'removed', 'modified', 'moved'])
    await expect(rows).toHaveText([/Partition wall/, /Front door/, /Window W1/, /Column C1/])

    // the canvas draws the building with every change accent on screen
    const canvas = page.getByTestId('diff-canvas').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvas)).covered, { timeout: 30_000 }).toBeGreaterThan(0.02)
    const drawn = await canvasPixels(canvas)
    for (const diffClass of Object.keys(accentHues)) {
      expect(drawn.accents[diffClass], `${diffClass} pixels`).toBeGreaterThan(20)
    }

    // the window: what changed, and its IFC properties from the lazy property panel, with the change marked
    await rows.filter({ hasText: 'Window W1' }).click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Modified')
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="overallWidth"]')).toContainText('+0.4')
    const properties = page.getByTestId('ifc-properties')
    await expect(properties).toBeVisible()
    await expect(properties.locator('[data-testid="ifc-property"][data-name="Class"]')).toContainText('IfcWindow')
    await expect(properties.locator('[data-testid="ifc-property"][data-name="Overall width"]')).toHaveAttribute(
      'data-changed',
      'true',
    )
    await expect(
      properties.locator('[data-testid="ifc-property"][data-group="Pset_WindowCommon"][data-name="IsExternal"]'),
    ).toContainText('Yes')

    // the column moved 3.5 m
    await rows.filter({ hasText: 'Column C1' }).click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 3,500 mm')

    // the storey filter: nothing changed on the first floor, its unchanged products are listed once Unchanged is on
    const storeys = page.getByTestId('ifc-storey-filter')
    await expect(storeys.locator('option')).toHaveText(['All storeys', 'Ground floor', 'First floor'])
    await storeys.selectOption('First floor')
    await expect(rows).toHaveCount(0)
    await page.keyboard.press('5')
    await expect(rows).toHaveCount(2)
    await expect(rows).toHaveText([/Column C2/, /First floor slab/])
    await storeys.selectOption('')
    await expect(rows).toHaveCount(13)

    // side by side, and back
    await page.getByTestId('diff-view-side-by-side').click()
    await expect(page.getByTestId('diff-canvas-a').locator('canvas')).toBeVisible()
    await expect(page.getByTestId('diff-canvas-b').locator('canvas')).toBeVisible()
  })

  test('two revisions of a DXF floor plan: classes, SVG colours, the slider and layers, side by side', async ({
    page,
  }) => {
    const files = await uploadRevisions(await openProject(page), 'dxf', [
      fixture('plan-v1.dxf'),
      fixture('plan-v2.dxf'),
    ])
    const view = await openUnifiedDiff(page, files)

    // the counts of the backend's dxf manifest, entities by handle
    await expectCounts(page, { added: '1', removed: '1', modified: '1', moved: '1', unchanged: '3' })
    const rows = page.getByTestId('diff-entity')
    await expect.poll(() => rowClasses(rows)).toEqual(['added', 'removed', 'modified', 'moved'])
    await expect(rows).toHaveText([/Line 3F/, /Circle 3D/, /Polyline 3C/, /DOOR-900/])

    // every entity is drawn in its class colour: B's added, modified and moved, A's removed and ghosted
    const canvas = page.getByTestId('diff-canvas')
    const entity = (side: 'a' | 'b', id: string) =>
      canvas.locator(`[data-diff-side="${side}"] [data-entity-id="${id}"]`)
    const style = (locator: Locator) =>
      locator.evaluate((element) => {
        const coloured = element.querySelector('[color]') || element
        return { colour: getComputedStyle(coloured).color, opacity: getComputedStyle(element).opacity }
      })
    await expect.poll(() => style(entity('b', '3F'))).toEqual({ colour: accents.added, opacity: '1' })
    await expect.poll(() => style(entity('a', '3D'))).toEqual({ colour: accents.removed, opacity: '0.3' })
    await expect.poll(() => style(entity('b', '3C'))).toEqual({ colour: accents.modified, opacity: '1' })
    await expect.poll(() => style(entity('a', '3C'))).toEqual({ colour: accents.modified, opacity: '0.25' })
    await expect.poll(() => style(entity('b', '3A'))).toEqual({ colour: accents.moved, opacity: '1' })
    await expect.poll(() => style(entity('b', '38'))).toEqual({ colour: accents.unchanged, opacity: '1' })
    await expect(canvas.locator('[data-diff-line]')).toHaveCount(1)

    // the slider puts the moved door back at A's placement
    const slider = page.getByTestId('diff-slider')
    await slider.fill('0')
    await expect(entity('b', '3A')).toHaveAttribute('transform', /^translate\(-500 0\)/)
    await slider.fill('100')
    await expect(entity('b', '3A')).not.toHaveAttribute('transform', /translate\(-500/)

    // clicking a row shows what changed
    await rows.filter({ hasText: 'DOOR-900' }).click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 500 mm')
    await rows.filter({ hasText: 'Polyline 3C' }).click()
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="length"]')).toContainText('+500')

    // a layer toggle hides the layer in both revisions
    await page.getByTestId('diff-layers').locator('summary').click()
    await page.locator('[data-testid="diff-layer"][data-layer="FURNITURE"]').uncheck()
    await expect(canvas.locator('[data-diff-side="a"] [data-layer="FURNITURE"]')).toHaveCSS('display', 'none')
    await expect(canvas.locator('[data-diff-side="b"] [data-layer="FURNITURE"]')).toHaveCSS('display', 'none')

    // side by side: A and B in two panes, one view
    await page.getByTestId('diff-view-side-by-side').click()
    await expect(view).toHaveAttribute('data-view', 'sideBySide')
    await expect(page.getByTestId('diff-canvas-a').locator('[data-entity-id="3D"]')).toBeAttached()
    await expect(page.getByTestId('diff-canvas-b').locator('[data-entity-id="3F"]')).toBeAttached()
    const viewBox = (testId: string) => page.getByTestId(testId).locator('svg').first().getAttribute('viewBox')
    await expect.poll(() => viewBox('diff-canvas-b')).toBe(await viewBox('diff-canvas-a'))
  })

  test('the previews: an IFC model with its property panel, a DXF drawing in the 2D viewer', async ({ page }) => {
    const projectId = await openProject(page)
    const building = await uploadRevisions(projectId, 'ifc', [fixture('building-v1.ifc'), fixture('building-v2.ifc')])
    await page.goto(`/files/${building.projectId}/${building.fileId}`)
    await expect(page.getByTestId('cad-viewer')).toBeVisible({ timeout: 90_000 })
    await expect(page.getByTestId('cad-status')).toContainText('12 parts')
    await page.getByTestId('cad-part').filter({ hasText: 'Partition wall' }).click()
    await expect(page.locator('[data-testid="ifc-property"][data-name="Class"]')).toContainText('IfcWall')
    await expect(page.locator('[data-testid="ifc-property"][data-name="FireRating"]')).toContainText('EI30')

    const plan = await uploadRevisions(projectId, 'dxf', [fixture('plan-v1.dxf'), fixture('plan-v2.dxf')])
    await page.goto(`/files/${plan.projectId}/${plan.fileId}`)
    await expect(page.getByTestId('drawing-viewer')).toBeVisible({ timeout: 90_000 })
    await expect(page.getByTestId('drawing-status')).toHaveText('6 entities · 3 layers')
    await expect(page.getByTestId('drawing-canvas').locator('[data-entity-id]')).toHaveCount(6)
  })
})
