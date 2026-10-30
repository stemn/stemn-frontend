import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { api, login, seedData, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

// the backend's shared two-part assembly sample (see fixtures/cad/README.md)
const ASSEMBLY_STEP = readFileSync(join(__dirname, '../fixtures/cad/assembly.step'))

/** Share of the canvas pixels the model covers (the viewer's background is transparent) */
const coveredPixels = (page: Page) =>
  page
    .getByTestId('cad-canvas')
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => {
      const copy = document.createElement('canvas')
      copy.width = canvas.width
      copy.height = canvas.height
      const context = copy.getContext('2d')!
      context.drawImage(canvas, 0, 0)
      const { data } = context.getImageData(0, 0, copy.width, copy.height)
      let covered = 0
      for (let alpha = 3; alpha < data.length; alpha += 4) if (data[alpha] > 0) covered++
      return covered / (copy.width * copy.height)
    })

test.describe('CAD preview (open-source converter)', () => {
  // conversion and the first three.js chunk load take a few seconds on a cold backend
  test.setTimeout(120_000)

  test('a STEP assembly uploaded to the CubeSat project renders in the glTF viewer with its part list', async ({
    page,
  }) => {
    // the project owner, so the render request is allowed
    await loginThroughForm(page, seedUsers.priya.email)
    await page.goto('/explore')
    await page.getByRole('link', { name: seedData.project }).first().click()
    await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}/)
    const projectId = new URL(page.url()).pathname.split('/')[2]

    // upload the fixture under a name no other run uses
    const token = await login(seedUsers.priya.email)
    const project = await api.get(`/api/v1/projects/${projectId}`, token)
    const name = `e2e-assembly-${Date.now().toString(36)}.step`
    const file = await api.request('POST', `/api/v1/sync/upload/${projectId}`, {
      token,
      raw: ASSEMBLY_STEP,
      query: { name, parentId: project.remote.root._id },
    })
    await api.get(`/api/v1/sync/fetchRemoteChanges/${projectId}`, token)

    await page.goto(`/files/${projectId}/${file.fileId}`)
    await expect(page).toHaveTitle(`${seedData.project} - ${name}`)

    // rendered by the OpenCascade converter and shown by the three.js viewer, not Autodesk's
    const viewer = page.getByTestId('cad-viewer')
    await expect(viewer).toBeVisible({ timeout: 90_000 })
    await expect(page.getByTestId('cad-status')).toContainText('OpenCascade · 2 parts')
    await expect(page.getByTestId('cad-part')).toHaveText(['base-plate', 'bracket'])
    await expect.poll(() => coveredPixels(page), { timeout: 30_000 }).toBeGreaterThan(0.02)

    // the toggles keep the model on screen
    await page.getByTestId('cad-wireframe').click()
    await expect(page.getByTestId('cad-wireframe')).toHaveAttribute('aria-pressed', 'true')
    await page.getByTestId('cad-section').click()
    await expect(page.getByTestId('cad-section-position')).toBeVisible()
    await page.getByTestId('cad-fit').click()
    await expect.poll(() => coveredPixels(page)).toBeGreaterThan(0.005)
  })
})
