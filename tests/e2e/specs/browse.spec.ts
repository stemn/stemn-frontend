import { seedData, seedUsers } from '../fixtures/backend'
import { expect, test } from '../fixtures/test'

test.describe('browsing', () => {
  test('dashboard feed shows activity from followed users and projects', async ({ adaPage: page }) => {
    await expect(page.getByRole('button', { name: /Feed: All/ })).toBeVisible()
    // Feed items link to a user and a project
    const firstItem = page.locator('a[href^="/project/"]').first()
    await expect(firstItem).toBeVisible()
  })

  test('explore lists public projects', async ({ page }) => {
    await page.goto('/explore')
    await expect(page).toHaveTitle('Explore')
    await expect(page.getByRole('link', { name: seedData.project }).first()).toBeVisible()
  })

  test('project overview shows the readme and the files', async ({ page }) => {
    await page.goto('/explore')
    await page.getByRole('link', { name: seedData.project }).first().click()
    await expect(page).toHaveURL(/\/project\/[0-9a-f]{24}$/)
    await expect(page).toHaveTitle(new RegExp(`^${seedData.project}`))
    for (const file of Object.values(seedData.files)) {
      await expect(page.getByRole('link', { name: file, exact: true })).toBeVisible()
    }
    // Project tabs
    for (const tab of ['Overview', 'Threads', 'History', 'Team']) {
      await expect(page.getByRole('link', { name: tab, exact: true })).toBeVisible()
    }
  })

  test('search finds projects', async ({ adaPage: page }) => {
    await page.getByPlaceholder('Search').fill('CubeSat')
    await page.getByPlaceholder('Search').press('Enter')
    await expect(page).toHaveURL(/\/search/)
    await expect(page.getByRole('link', { name: seedData.project }).first()).toBeVisible()
  })

  test('notifications page lists notifications', async ({ adaPage: page }) => {
    // The header link (its accessible name is the unread count once the notifications are loaded)
    await page.locator('[data-tag="view-notifications"]').click()
    await expect(page).toHaveURL(/\/notifications/)
    await expect(page).toHaveTitle('Notifications')
    await page.getByRole('link', { name: 'All Notifications' }).click()
    await expect(page).toHaveURL(/\/notifications\/all$/)
    // Ada is mentioned in and follows seeded threads/projects, so there are notifications
    await expect(page.locator('a[href^="/project/"], a[href^="/users/"]').first()).toBeVisible()
  })

  test('profile and followers', async ({ adaPage: page }) => {
    await page.locator('[class*="Header_"] [class*="UserAvatar"]').first().click()
    await page.getByRole('link', { name: 'My Profile' }).click()
    await expect(page).toHaveURL(/\/users\/[0-9a-f]{24}$/)
    await expect(page.getByText(seedUsers.ada.name).first()).toBeVisible()
    await page
      .getByRole('link', { name: /Followers/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/followers$/)
    // Seeded follows: Ada has followers, each row links to a user profile
    await expect(page.locator('a[href^="/users/"]').nth(1)).toBeVisible()
  })
})
