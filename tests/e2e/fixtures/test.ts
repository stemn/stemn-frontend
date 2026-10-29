import { test as base, expect, type Page } from '@playwright/test'
import { SEED_PASSWORD, seedUsers } from './backend'

export { expect }

/** Logs in through the login form and waits for the dashboard */
export const loginThroughForm = async (page: Page, email: string, password = SEED_PASSWORD) => {
  await page.goto('/login')
  await page.getByPlaceholder('Email').fill(email)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
}

type Fixtures = {
  /** Page logged in as Ada Lovelace (seed user) */
  adaPage: Page
  /** Uncaught page errors collected during the test (asserted empty after each test) */
  pageErrors: string[]
}

export const test = base.extend<Fixtures>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
      expect(errors, 'uncaught exceptions in the page').toEqual([])
    },
    { auto: true },
  ],
  adaPage: async ({ page }, use) => {
    await loginThroughForm(page, seedUsers.ada.email)
    await use(page)
  },
})
