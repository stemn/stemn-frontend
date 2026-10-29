import { newAccount, seedUsers } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

test.describe('authentication', () => {
  test('register a new account and go through onboarding', async ({ page }) => {
    const account = newAccount('register')
    await page.goto('/register')
    await page.getByPlaceholder('First name').fill(account.firstname)
    await page.getByPlaceholder('Last name').fill(account.lastname)
    await page.getByPlaceholder('Email').fill(account.email)
    await page.getByPlaceholder('Password').fill(account.password)
    await page.getByRole('button', { name: 'Register' }).click()

    // Onboarding: about you -> sync account -> download -> dashboard
    await expect(page).toHaveURL(/\/onboarding$/)
    await expect(page).toHaveTitle('Welcome to Stemn')
    await page.getByPlaceholder(/Structural Engineer/).fill('I test Stemn end to end')
    await page.getByRole('link', { name: 'Next: Sync Account' }).click()
    await expect(page).toHaveURL(/\/onboarding\/sync$/)
    await expect(page.getByRole('heading', { name: /cloud providers/i })).toBeVisible()
    await page.getByRole('link', { name: 'Next: Download' }).click()
    await expect(page).toHaveURL(/\/onboarding\/download$/)
    await page.getByRole('link', { name: 'Go to Dashboard' }).click()
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page).toHaveTitle('Dashboard')
  })

  test('wrong password shows an error and stays on the login page', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Email').fill(seedUsers.ada.email)
    await page.getByPlaceholder('Password').fill('not-the-password')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText(/incorrect email or password/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('log in and log out', async ({ page }) => {
    await loginThroughForm(page, seedUsers.ada.email)
    await expect(page).toHaveTitle('Dashboard')

    // The session survives a reload (redux-persist)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    await page.locator('[class*="Header_"] [class*="UserAvatar"]').first().click()
    // the Logout entry is an <a> without href
    await page.locator('.PopoverMenu a', { hasText: 'Logout' }).click()
    // Logged out: the home route is the landing page again
    await expect(page).toHaveURL(/\/(landing)?$/)
    await page.goto('/')
    await expect(page).toHaveURL(/\/landing$/)
    await expect(page.getByRole('link', { name: 'SIGN IN' })).toBeVisible()
  })
})
