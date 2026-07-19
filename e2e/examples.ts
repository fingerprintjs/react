/**
 * Single source of truth for the example apps exercised by the e2e suite.
 *
 * Each entry maps an example directory name (also used as the `EXAMPLE` env var
 * and the CI matrix key) to how Playwright should start and reach it. A CI job
 * runs exactly one example, selected via `EXAMPLE`, so ports only need to be
 * unique enough to run locally side by side.
 *
 * Commands use pnpm path filters (`--filter ./examples/<dir>`) so the directory
 * name is the only identifier needed here, in CI, and in the React-version
 * override step.
 */
export interface ExampleConfig {
  /** Port the dev server listens on. */
  port: number
  /** Command Playwright runs to boot the example (from the repo root). */
  command: string
  /** Extra env for the dev server process. */
  env?: Record<string, string>
}

export const EXAMPLES: Record<string, ExampleConfig> = {
  'create-react-app': {
    port: 3001,
    command: 'pnpm --filter ./examples/create-react-app dev',
    // react-scripts otherwise tries to open a browser and treats warnings as
    // errors under CI.
    env: { BROWSER: 'none', CI: 'false' },
  },
  next: {
    port: 3002,
    command: 'pnpm --filter ./examples/next dev',
  },
  'next-appDir': {
    port: 3003,
    command: 'pnpm --filter ./examples/next-appDir dev',
  },
  preact: {
    // preact-cli's dev server (`watch`) fails to resolve its entrypoint on the
    // CI Node version, so build once and serve the static output with sirv
    // (its `serve` script listens on 8080).
    port: 8080,
    command: 'pnpm --filter ./examples/preact build && pnpm --filter ./examples/preact serve',
  },
  vite: {
    port: 5173,
    command: 'pnpm --filter ./examples/vite dev -- --port 5173 --strictPort',
  },
  'webpack-based': {
    port: 8081,
    command: 'pnpm --filter ./examples/webpack-based dev -- --port 8081',
  },
}

export function resolveExample(name: string | undefined): { name: string; config: ExampleConfig } {
  if (name === undefined || name === '') {
    throw new Error(`EXAMPLE env var is required. One of: ${Object.keys(EXAMPLES).join(', ')}`)
  }
  if (!(name in EXAMPLES)) {
    throw new Error(`Unknown example "${name}". One of: ${Object.keys(EXAMPLES).join(', ')}`)
  }
  return { name, config: EXAMPLES[name] }
}
