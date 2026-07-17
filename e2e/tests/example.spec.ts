import { test, expect } from '@playwright/test'

// A Fingerprint v4 visitor ID is a 20-character alphanumeric string. Every
// example renders it once identification succeeds (as "Welcome <id>!" or in a
// "VisitorId:" field), so asserting the pattern appears verifies the SDK loaded
// the agent, called the API, and surfaced a result through the React hooks.
const VISITOR_ID = /[A-Za-z0-9]{20}/

test('identifies the visitor and renders a visitor ID', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')

  await expect(async () => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body, `page still shows no visitor ID:\n${body}`).toMatch(VISITOR_ID)
  }).toPass({ timeout: 60_000 })

  expect(errors, `uncaught errors on the page:\n${errors.join('\n')}`).toEqual([])
})
