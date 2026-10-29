import type { Page } from '@playwright/test'
import { PNG_FIXTURE, createProjectWithFiles, seedData } from '../fixtures/backend'
import { expect, test } from '../fixtures/test'

const openSeedFile = async (page: Page, name: string) => {
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await page.getByRole('link', { name: name, exact: true }).click()
  await expect(page).toHaveURL(/\/files\/[0-9a-f]{24}\/[0-9a-f]{24}/)
  await expect(page).toHaveTitle(`${seedData.project} - ${name}`)
}

/** The image preview has loaded and laid out the image */
const expectImageRendered = async (page: Page) => {
  const image = page.locator('img[src^="blob:"]')
  await expect(image).toBeVisible()
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
}

test.describe('file previews', () => {
  test('markdown', async ({ page }) => {
    await openSeedFile(page, seedData.files.md)
    // Markdown files open in the code view (CodeMirror)
    await expect(page.locator('.CodeMirror')).toContainText(`# ${seedData.project}`)
  })

  test('pdf (pdf.js canvas + text layer)', async ({ page }) => {
    await openSeedFile(page, seedData.files.pdf)
    await expect(page.locator('canvas').first()).toBeVisible()
    await expect(page.locator('[class*="PreviewPdf_textLayer"] span').first()).toBeAttached()
  })

  test('pipeline (flow graph or yaml)', async ({ page }) => {
    await openSeedFile(page, seedData.files.pipeline)
    await expect(page.locator('[class*="PipelineGraph"], .CodeMirror').first()).toBeVisible()
  })

  test('image (svg)', async ({ page }) => {
    await openSeedFile(page, seedData.files.svg)
    await expectImageRendered(page)
  })

  test('image (png, uploaded to a fresh project)', async ({ page }) => {
    const { projectId } = await createProjectWithFiles({ 'pixels.png': PNG_FIXTURE })
    await page.goto(`/project/${projectId}`)
    await page.getByRole('link', { name: 'pixels.png', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/files/${projectId}/[0-9a-f]{24}`))
    await expectImageRendered(page)
  })
})
