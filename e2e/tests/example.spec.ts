import { test, expect } from '@playwright/test'

// Every example renders the visitor ID in:
//   <span data-testid="visitor-id">…</span>
// Asserting on that node (not the whole body) avoids false passes from
// error copy that can contain 20-char event/request ids.
const VISITOR_ID = /^[A-Za-z0-9]{20}$/

test('identifies the visitor and renders a visitor ID', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')

  await expect(page.getByTestId('visitor-id')).toHaveText(VISITOR_ID, { timeout: 60_000 })

  expect(errors, `uncaught errors on the page:\n${errors.join('\n')}`).toEqual([])
})
