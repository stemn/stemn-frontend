/**
 * Threads and comments run on the generated API client + TanStack Query (docs/API-CLIENT.md).
 * These tests cover the migrated slice end to end: the mutations from the UI, and changes made by
 * someone else arriving through the websocket (the events invalidate the queries, which refetch).
 */
import { createThreadsProject, newAccount, registerAccount, threadsApi } from '../fixtures/backend'
import { expect, loginThroughForm, test } from '../fixtures/test'

const unique = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

test.describe('threads and comments (TanStack Query)', () => {
  test('changes made by someone else appear live, without a reload', async ({ adaPage: page }) => {
    // Another user's public project, which Ada (logged in) is looking at
    const { account, projectId, board } = await createThreadsProject('live')
    const name = `Live thread ${unique()}`
    const thread = await threadsApi.create(account.token, projectId, board, name)
    // Posted before Ada opens the thread (edited live below)
    const body = `Live comment ${unique()}`
    const comment = await threadsApi.comment(account.token, thread._id, body)

    // Thread list: a thread created by the other user appears (BOARD/GROUPS_UPDATED in the board room)
    await page.goto(`/project/${projectId}/threads`)
    await expect(page.getByRole('link', { name })).toBeVisible()
    const another = `Another live thread ${unique()}`
    await threadsApi.create(account.token, projectId, board, another)
    await expect(page.getByRole('link', { name: another })).toBeVisible()

    // Thread page (THREAD/THREAD_UPDATED and THREAD/COMMENT_UPDATED in the thread room)
    await page.getByRole('link', { name }).click()
    await expect(page).toHaveURL(/\/threads\/[0-9a-f]{24}$/)
    await expect(page.getByRole('heading', { name: new RegExp(name) })).toBeVisible()
    await expect(page.getByText('Thread Open')).toBeVisible()
    await expect(page.getByRole('paragraph').filter({ hasText: body })).toBeVisible()

    // The thread query, invalidated by THREAD/THREAD_UPDATED
    const renamed = `${name} renamed`
    await threadsApi.update(account.token, thread._id, { name: renamed })
    await expect(page.getByRole('heading', { name: new RegExp(renamed) })).toBeVisible()

    // A new comment: THREAD/THREAD_UPDATED refetches the (Redux) timeline, whose new event renders
    // the comment from the batched comments query
    const anotherComment = `Another live comment ${unique()}`
    await threadsApi.comment(account.token, thread._id, anotherComment)
    await expect(page.getByRole('paragraph').filter({ hasText: anotherComment })).toBeVisible()

    // The comment query, invalidated by THREAD/COMMENT_UPDATED
    await threadsApi.editComment(account.token, thread._id, comment._id, `${body} edited`)
    await expect(page.getByRole('paragraph').filter({ hasText: `${body} edited` })).toBeVisible()

    await threadsApi.update(account.token, thread._id, { complete: true })
    await expect(page.getByText('Thread Closed')).toBeVisible()
  })

  test('create a thread, then comment, edit, close and rename it from the UI', async ({ page }) => {
    const { account, projectId } = await createThreadsProject('ui')
    await loginThroughForm(page, account.email, account.password)
    await page.goto(`/project/${projectId}/threads`)

    // Create (projects/:id/threads mutation), then the app opens the thread
    const name = `UI thread ${unique()}`
    await page.getByRole('button', { name: 'New Thread' }).click()
    await page.getByPlaceholder('Untitled Thread').fill(name)
    await page.getByRole('button', { name: 'Create', exact: true }).click()
    await expect(page).toHaveURL(/\/threads\/[0-9a-f]{24}$/)
    await expect(page.getByRole('heading', { name: new RegExp(name) })).toBeVisible()

    // Comment
    const body = `UI comment ${unique()}`
    await page.locator('[class*="CommentNew_commentNew"]').click()
    await page.locator('[class*="CommentNew_commentNew"] .CodeMirror').click()
    await page.keyboard.type(body)
    await page.getByRole('button', { name: 'Comment', exact: true }).click()
    await expect(page.getByRole('paragraph').filter({ hasText: body })).toBeVisible()

    // Edit the comment (its menu: Edit, then Save)
    const commentBox = page.locator('[class*="Comment_comment-"]').filter({ hasText: body })
    await commentBox.locator('[class*="Comment_commentHeader"] button').last().click()
    await page.locator('.PopoverMenu').getByText('Edit', { exact: true }).click()
    await commentBox.locator('.CodeMirror').click()
    await page.keyboard.press('End')
    await page.keyboard.type(' edited')
    await commentBox.getByText('Save', { exact: true }).click()
    await expect(page.getByRole('paragraph').filter({ hasText: `${body} edited` })).toBeVisible()

    // Close it (optimistic update, saved with PUT /threads/:id)
    await page.getByRole('button', { name: 'Status: Open' }).click()
    await page.locator('.PopoverMenu').getByText('Status: Closed', { exact: true }).click()
    await expect(page.getByRole('button', { name: 'Status: Closed' })).toBeVisible()

    // Rename it in the edit mode
    const renamed = `${name} renamed`
    await page.getByRole('link', { name: 'Edit', exact: true }).click()
    await expect(page).toHaveURL(/\/edit$/)
    await page.getByPlaceholder('Thread Title').fill(renamed)
    await page.getByRole('link', { name: 'Save', exact: true }).click()
    await expect(page).toHaveURL(/\/threads\/[0-9a-f]{24}$/)
    await expect(page.getByRole('heading', { name: new RegExp(renamed) })).toBeVisible()

    // Everything was saved on the server
    await page.reload()
    await expect(page.getByRole('heading', { name: new RegExp(renamed) })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Status: Closed' })).toBeVisible()
    await expect(page.getByRole('paragraph').filter({ hasText: `${body} edited` })).toBeVisible()
  })
})

test.describe('notifications (TanStack Query)', () => {
  test('a comment by someone else is notified, and marking it read clears the badge', async ({ page }) => {
    const { account, projectId, board } = await createThreadsProject('notified')
    const thread = await threadsApi.create(account.token, projectId, board, `Notified thread ${unique()}`)
    // Someone else comments on the account's thread (more than 2 s after its creation, otherwise the API
    // takes the comment for the thread's body and does not notify)
    const commenter = await registerAccount(newAccount('commenter'))
    await new Promise((resolve) => setTimeout(resolve, 2500))
    await threadsApi.comment(commenter.token, thread._id, `Notified comment ${unique()}`)

    await loginThroughForm(page, account.email, account.password)
    const badge = page.locator('[data-tag="view-notifications"] [class*="Header_badge"]')
    await expect(badge).toHaveText('1')

    await page.locator('[data-tag="view-notifications"]').click()
    await expect(page).toHaveURL(/\/notifications$/)
    await expect(page.getByText('No unread notifications')).toBeHidden()
    await page.getByRole('button', { name: 'Mark as read' }).click()
    // Optimistic: the unread tab and the header badge (the same query) update at once
    await expect(page.getByText('No unread notifications')).toBeVisible()
    await expect(badge).toBeHidden()

    // Saved on the server
    await page.reload()
    await expect(page.getByText('No unread notifications')).toBeVisible()
    await page.getByRole('link', { name: 'All Notifications' }).click()
    await expect(page.locator('a[href^="/users/"]').filter({ hasText: commenter.lastname })).toBeVisible()
  })
})
