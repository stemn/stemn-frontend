import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's shared revision pair: one entity of each class (see fixtures/cad/README.md)
const V1 = readFileSync(join(__dirname, '../fixtures/cad/bracket-assembly-v1.step'))
const V2 = readFileSync(join(__dirname, '../fixtures/cad/bracket-assembly-v2.step'))

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

/** Uploads v1 of the assembly to the CubeSat project and v2 as its second revision, as the project owner */
const uploadRevisions = async (page: Page) => {
  await loginThroughForm(page, seedUsers.priya.email)
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
  const projectId = new URL(page.url()).pathname.split('/')[2]

  const token = await login(seedUsers.priya.email)
  const project = await api.get(`/api/v1/projects/${projectId}`, token)
  const name = `e2e-diff-${Date.now().toString(36)}.step`
  const file = await api.request('POST', `/api/v1/sync/upload/${projectId}`, {
    token,
    raw: V1,
    query: { name, parentId: project.remote.root._id },
  })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  const revision = await api.request('POST', `/api/v1/sync/upload/${projectId}/${file.fileId}`, { token, raw: V2 })
  await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)
  expect(revision.revisionId).not.toBe(file.revisionId)
  return { projectId, fileId: file.fileId, name, revisionA: file.revisionId, revisionB: revision.revisionId }
}

test.describe('CAD diff viewer (unified view and side by side)', () => {
  // two conversions and the first three.js chunk load take a while on a cold backend
  test.setTimeout(180_000)

  test('two revisions of a STEP assembly show all five classes, the slider, the entity panel and side by side', async ({
    page,
  }) => {
    const { projectId, fileId, name, revisionA, revisionB } = await uploadRevisions(page)

    await page.goto(`/files/${projectId}/${fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    // the compare menu offers the unified diff for CAD files; then pick the two revisions on the timeline
    await page.getByTitle('Compare').click()
    await page.getByText('Compare: Unified Diff').click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionA}"]`).click()
    await page.locator(`[data-testid="timeline-dot"][data-revision-id="${revisionB}"]`).click()

    const view = page.getByTestId('diff-view')
    await expect(view).toBeVisible({ timeout: 120_000 })
    await expect(view).toHaveAttribute('data-view', 'unified')

    // the counts of the backend's manifest on the filter toggles
    const counts = { added: '1', removed: '1', modified: '2', moved: '1', unchanged: '1' }
    for (const [diffClass, count] of Object.entries(counts)) {
      await expect(page.getByTestId(`diff-count-${diffClass}`)).toHaveText(count)
    }
    await expect(page.getByTestId('diff-filter-unchanged')).toHaveAttribute('aria-pressed', 'false')

    // the entity panel lists the changed entities, Unchanged once its filter is on
    const rows = page.getByTestId('diff-entity')
    await expect(rows).toHaveCount(5)
    await expect
      .poll(() => rows.evaluateAll((elements) => elements.map((row) => (row as HTMLElement).dataset.class)))
      .toEqual(['added', 'removed', 'modified', 'modified', 'moved'])
    await page.keyboard.press('5')
    await expect(page.getByTestId('diff-filter-unchanged')).toHaveAttribute('aria-pressed', 'true')
    await expect(rows).toHaveCount(6)

    // the canvas draws the model, with every change accent on screen
    const canvas = page.getByTestId('diff-canvas').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvas)).covered, { timeout: 30_000 }).toBeGreaterThan(0.02)
    const drawn = await canvasPixels(canvas)
    for (const diffClass of Object.keys(accentHues)) {
      expect(drawn.accents[diffClass], `${diffClass} pixels`).toBeGreaterThan(30)
    }

    // the slider crossfades A -> B and moves the spacer back to its A position
    const slider = page.getByTestId('diff-slider')
    await expect(slider).toHaveValue('100')
    await slider.fill('0')
    await expect(slider).toHaveValue('0')
    await expect.poll(async () => (await canvasPixels(canvas)).fingerprint).not.toBe(drawn.fingerprint)
    await slider.fill('100')

    // clicking an entity focuses it and shows what changed
    await page.locator('[data-testid="diff-entity"][data-entity-id="bracket-assembly/spacer"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Moved 60 mm')
    await page.locator('[data-testid="diff-entity"][data-entity-id="bracket-assembly/base-plate"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Modified')
    await expect(page.locator('[data-testid="diff-delta"][data-attribute="faces"]')).toContainText('+1')
    await page.getByTestId('diff-swap').click()
    await expect(page.getByTestId('diff-swap')).toHaveAttribute('aria-pressed', 'true')
    await page.locator('[data-testid="diff-entity"][data-entity-id="bracket-assembly/pin"]').click()
    await expect(page.getByTestId('diff-entity-summary')).toHaveText('Removed in B')

    // "changes only" hides the unchanged nut
    await page.getByTestId('diff-changes-only').check()
    await expect(page.getByTestId('diff-changes-only')).toBeChecked()

    // side by side: A and B in two panes whose cameras move together
    await page.getByTestId('diff-view-side-by-side').click()
    await expect(view).toHaveAttribute('data-view', 'sideBySide')
    const canvasA = page.getByTestId('diff-canvas-a').locator('canvas')
    const canvasB = page.getByTestId('diff-canvas-b').locator('canvas')
    await expect.poll(async () => (await canvasPixels(canvasA)).covered, { timeout: 30_000 }).toBeGreaterThan(0.01)
    await expect.poll(async () => (await canvasPixels(canvasB)).covered).toBeGreaterThan(0.01)
    const before = await canvasPixels(canvasB)
    const box = (await canvasA.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 40, { steps: 8 })
    await page.mouse.up()
    await expect.poll(async () => (await canvasPixels(canvasB)).fingerprint).not.toBe(before.fingerprint)

    // and back with the keyboard
    await page.keyboard.press('u')
    await expect(view).toHaveAttribute('data-view', 'unified')
  })
})
