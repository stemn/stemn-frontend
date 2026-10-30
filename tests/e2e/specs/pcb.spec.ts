import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's shared PCB samples: blinky v1 -> v2, one entity of each class (see fixtures/pcb/README.md)
const fixture = (name: string) => readFileSync(join(__dirname, '../fixtures/pcb', name))
const changes = JSON.parse(fixture('samples.json').toString())['blinky-v2.kicad_pcb'].changes

// the diff viewer's class accents (stemn-frontend-shared/src/misc/FileDiff/diff.utils.ts)
const accents = {
  added: 'rgb(47, 158, 88)',
  removed: 'rgb(214, 69, 65)',
  modified: 'rgb(232, 163, 23)',
  moved: 'rgb(58, 123, 213)',
  unchanged: 'rgb(167, 173, 181)',
}

/** How a revision's copy of an entity is drawn: its first shape's fill and the entity's own opacity */
const drawn = (canvas: Locator, side: 'a' | 'b', id: string) =>
  canvas.evaluate(
    (element, [side, id]) => {
      const entity = element.querySelector(`[data-diff-side="${side}"] [data-entity-id="${id}"]`) as SVGElement | null
      if (!entity) return null
      const shape = entity.querySelector('path, circle') as SVGElement
      return {
        fill: getComputedStyle(shape).fill,
        opacity: entity.style.opacity,
        display: getComputedStyle(entity).display,
      }
    },
    [side, id],
  )

/** Uploads the first sample to the CubeSat project as the project owner, and the others as its next revisions */
const upload = async (page: Page, extension: string, samples: string[]) => {
  await loginThroughForm(page, seedUsers.priya.email)
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
  const projectId = new URL(page.url()).pathname.split('/')[2]

  const token = await login(seedUsers.priya.email)
  const project = await api.get(`/api/v1/projects/${projectId}`, token)
  const name = `e2e-blinky-${Date.now().toString(36)}.${extension}`
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

test.describe('PCB and electronics (KiCad converter)', () => {
  // the first conversions and the 2D viewer chunk take a few seconds on a cold backend
  test.setTimeout(180_000)

  test('a KiCad board previews as a layered drawing with layer toggles', async ({ page }) => {
    const { projectId, fileId, name } = await upload(page, 'kicad_pcb', ['blinky-v1.kicad_pcb'])

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    const viewer = page.getByTestId('pcb-viewer')
    await expect(viewer).toBeVisible({ timeout: 90_000 })
    await expect(viewer).toHaveAttribute('data-format', 'kicad_pcb')
    await expect(page.getByTestId('pcb-status')).toHaveText('KiCad board · 11 entities · 10 layers')

    // the board's copper is drawn, in KiCad's colours, and the mask starts hidden
    const canvas = page.getByTestId('pcb-canvas')
    const copper = canvas.locator('[data-layer="F.Cu"]')
    await expect(copper).toBeVisible()
    await expect(canvas.locator('[data-layer="F.Mask"]')).toBeHidden()
    expect(
      await copper
        .locator('path')
        .first()
        .evaluate((path) => getComputedStyle(path).fill),
    ).toBe('rgb(200, 52, 52)')

    // a layer toggled off disappears
    await page.getByTestId('diff-layers').locator('summary').click()
    await page.locator('[data-testid="diff-layer"][data-layer="F.Cu"]').uncheck()
    await expect(copper).toBeHidden()
    await page.getByTestId('pcb-fit').click()
  })

  test('two revisions of a board diff entity by entity: counts, entity panel and class colours on the drawing', async ({
    page,
  }) => {
    const { projectId, fileId, name, revisions } = await upload(page, 'kicad_pcb', [
      'blinky-v1.kicad_pcb',
      'blinky-v2.kicad_pcb',
    ])
    const [revisionA, revisionB] = revisions

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    // PCB files get the unified diff in the compare menu, like CAD files
    await page.getByTitle('Compare').click()
    await page.getByText('Compare: Unified Diff').click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionA}"]`).click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionB}"]`).click()

    const view = page.getByTestId('diff-view')
    await expect(view).toBeVisible({ timeout: 120_000 })
    await expect(view).toHaveAttribute('data-view', 'unified')

    // one entity of each class, the rest unchanged (samples.json)
    const counts = { added: '1', removed: '1', modified: '1', moved: '1', unchanged: String(changes.unchanged.length) }
    for (const [diffClass, count] of Object.entries(counts)) {
      await expect(page.getByTestId(`diff-count-${diffClass}`)).toHaveText(count)
    }

    const rows = page.getByTestId('diff-entity')
    await expect
      .poll(() => rows.evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.class)))
      .toEqual(['added', 'removed', 'modified', 'moved'])
    await expect(rows).toHaveText([/TP1/, /C2/, /R2/, /R1/])

    // the drawing: added in green, removed red and ghosted in its old place, modified amber, moved blue
    const canvas = page.getByTestId('diff-canvas')
    const [added] = changes.added
    const [removed] = changes.removed
    const [modified] = changes.modified
    const [moved] = changes.moved
    await expect.poll(() => drawn(canvas, 'b', added)).toMatchObject({ fill: accents.added, display: 'inline' })
    await expect.poll(() => drawn(canvas, 'a', removed)).toMatchObject({ fill: accents.removed, opacity: '0.3' })
    await expect.poll(() => drawn(canvas, 'b', modified)).toMatchObject({ fill: accents.modified })
    await expect.poll(() => drawn(canvas, 'b', moved)).toMatchObject({ fill: accents.moved })
    await expect.poll(() => drawn(canvas, 'b', changes.unchanged[0])).toMatchObject({ fill: accents.unchanged })

    // the entity panel says what changed
    await page.locator(`[data-testid="diff-entity"][data-entity-id="${moved}"]`).click()
    await expect(page.getByTestId('diff-entity-summary')).toContainText('turned 90°')
    await page.locator(`[data-testid="diff-entity"][data-entity-id="${modified}"]`).click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Modified')
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="footprint"]')).toContainText(
      'R_0805_2012Metric',
    )
    await page.locator(`[data-testid="diff-entity"][data-entity-id="${removed}"]`).click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Removed in B')

    // side by side: both revisions, removed only in A and added only in B
    await page.getByTestId('diff-view-side-by-side').click()
    await expect(view).toHaveAttribute('data-view', 'sideBySide')
    await expect
      .poll(() => drawn(page.getByTestId('diff-canvas-a'), 'a', removed))
      .toMatchObject({ fill: accents.removed })
    await expect.poll(() => drawn(page.getByTestId('diff-canvas-b'), 'b', added)).toMatchObject({ fill: accents.added })
  })
})
