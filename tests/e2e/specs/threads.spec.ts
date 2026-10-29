import { seedData } from '../fixtures/backend'
import { expect, test } from '../fixtures/test'

test('open a thread and post a comment', async ({ adaPage: page }) => {
  await page.goto('/explore')
  await page.getByRole('link', { name: seedData.project }).first().click()
  await page.getByRole('link', { name: 'Threads', exact: true }).click()
  await expect(page).toHaveURL(/\/threads$/)
  await page.getByRole('link', { name: seedData.thread }).first().click()
  await expect(page).toHaveURL(/\/threads\/[0-9a-f]{24}$/)
  await expect(page.getByRole('heading', { name: new RegExp(seedData.thread) })).toBeVisible()

  const comment = `E2E comment ${Date.now()}`
  // The new comment box expands into a CodeMirror editor when clicked
  await page.locator('[class*="CommentNew_commentNew"]').click()
  await page.locator('[class*="CommentNew_commentNew"] .CodeMirror').click()
  await page.keyboard.type(comment)
  await page.getByRole('button', { name: 'Comment', exact: true }).click()
  // Rendered as a markdown paragraph in the timeline
  await expect(page.getByRole('paragraph').filter({ hasText: comment })).toBeVisible()

  // Persisted on the server
  await page.reload()
  await expect(page.getByRole('paragraph').filter({ hasText: comment })).toBeVisible()
})
