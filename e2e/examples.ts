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
 *
 * Each command is a production `build` followed by that example's serve path
 * (`start` / `preview` / `serve`), not `dev`. Typechecking, if any, lives in
 * the example's own `build` script.
 */
export interface ExampleConfig {
  /** Port the example server listens on. */
  port: number
  /** Command Playwright runs to build and serve the example (from the repo root). */
  command: string
}

export const EXAMPLES = {
  'create-react-app': {
    port: 3001,
    command: 'pnpm --filter ./examples/create-react-app build && pnpm --filter ./examples/create-react-app serve',
  },
  next: {
    port: 3002,
    command: 'pnpm --filter ./examples/next build && pnpm --filter ./examples/next start',
  },
  'next-appDir': {
    port: 3003,
    command: 'pnpm --filter ./examples/next-appDir build && pnpm --filter ./examples/next-appDir start',
  },
  preact: {
    port: 8080,
    command: 'pnpm --filter ./examples/preact build && pnpm --filter ./examples/preact serve',
  },
  vite: {
    port: 5173,
    command: 'pnpm --filter ./examples/vite build && pnpm --filter ./examples/vite preview',
  },
  'webpack-based': {
    // JS-only example — its `build` does not typecheck.
    port: 8081,
    command: 'pnpm --filter ./examples/webpack-based build && pnpm --filter ./examples/webpack-based serve',
  },
} as const satisfies Record<string, ExampleConfig>

export type ExampleName = keyof typeof EXAMPLES

function isExampleName(name: string): name is ExampleName {
  return Object.hasOwn(EXAMPLES, name)
}

export function resolveExample(name: string | undefined): { name: ExampleName; config: ExampleConfig } {
  if (name === undefined || name === '') {
    throw new Error(`EXAMPLE env var is required. One of: ${Object.keys(EXAMPLES).join(', ')}`)
  }
  if (!isExampleName(name)) {
    throw new Error(`Unknown example "${name}". One of: ${Object.keys(EXAMPLES).join(', ')}`)
  }
  return { name, config: EXAMPLES[name] }
}
