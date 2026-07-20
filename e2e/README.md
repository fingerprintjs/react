# End-to-end tests

Browser e2e tests that boot each [example app](../examples) with Playwright and
assert the Fingerprint React SDK identifies the visitor (a visitor ID is
rendered on the page).

## How it works

- [`examples.ts`](./examples.ts) is the single source of truth: it maps each
  example directory to the build+serve command and the port it listens on.
- [`playwright.config.ts`](./playwright.config.ts) reads the `EXAMPLE`
  environment variable, builds and serves that one example, and points the
  tests at it.
- [`tests/example.spec.ts`](./tests/example.spec.ts) is framework-agnostic: it
  loads the app and waits for `[data-testid="visitor-id"]` to show a visitor ID.

CI runs one example per job across a matrix of React versions
(see [`.github/workflows/e2e.yml`](../.github/workflows/e2e.yml)).

## Running locally

A live Fingerprint **public API key** is required. The key's region must match
`*_FPJS_REGION` (see each example's `.env.example`).

```bash
# from the repo root
pnpm install
pnpm build            # build the SDK the examples consume

# point the examples at your key + region
export VITE_FPJS_PUBLIC_API_KEY=<key>
export REACT_APP_FPJS_PUBLIC_API_KEY=<key>
export NEXT_PUBLIC_FPJS_PUBLIC_API_KEY=<key>
export PREACT_APP_FPJS_PUBLIC_API_KEY=<key>
export VITE_FPJS_REGION=eu REACT_APP_FPJS_REGION=eu NEXT_PUBLIC_FPJS_REGION=eu PREACT_APP_FPJS_REGION=eu

pnpm exec playwright install chromium

EXAMPLE=vite pnpm test:e2e
```

Valid `EXAMPLE` values: `create-react-app`, `next`, `next-appDir`, `preact`,
`vite`, `webpack-based`.
