import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { resolveExample } from './examples'

// Playwright compiles this config as CommonJS, so `__dirname` (the e2e/ dir) is
// available; its parent is the repo root, from where example servers are run.
const repoRoot = path.resolve(__dirname, '..')

// A CI job runs one example at a time. `EXAMPLE` selects which one; Playwright
// builds and serves it, then tears the server down when the run finishes.
const { name, config } = resolveExample(process.env.EXAMPLE)
const baseURL = `http://localhost:${String(config.port)}`
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests',
  // Leave enough headroom for the test's 60-second remote-service assertion.
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: isCI,
  // The JS agent talks to a remote service, so the first load can be flaky.
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: config.command,
    cwd: repoRoot,
    url: baseURL,
    reuseExistingServer: !isCI,
    // Production builds (esp. Next) can take a while on cold CI runners.
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  metadata: { example: name },
})
